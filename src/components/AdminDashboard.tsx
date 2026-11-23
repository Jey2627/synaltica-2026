import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LogOut,
  Search,
  Download,
  Trash2,
  X,
  Users,
  TrendingUp,
  Eye,
  Loader2,
  ShieldCheck,
  Lock,
  Mail,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { EVENTS, getEventByCode } from '@/data/events';
import { useCountUp } from '@/hooks/useReveal';
import type { TeamMember } from '@/lib/registration';

interface AdminReg {
  id: string;
  registration_id: string;
  event_code: string;
  participant_name: string;
  college: string;
  department: string;
  year_of_study: string;
  email: string;
  mobile: string;
  team_name: string | null;
  team_leader_name: string | null;
  team_members: TeamMember[];
  created_at: string;
}

interface AdminDashboardProps {
  onBackHome: () => void;
}

export default function AdminDashboard({ onBackHome }: AdminDashboardProps) {
  const [session, setSession] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [regs, setRegs] = useState<AdminReg[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [query, setQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [selected, setSelected] = useState<AdminReg | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReg | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) setSession(!!s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setLoadError(error.message);
    } else {
      setRegs((data ?? []) as AdminReg[]);
    }
    setLoadingRegs(false);
  }, []);

  useEffect(() => {
    if (session) loadRegistrations();
  }, [session, loadRegistrations]);

  const colleges = useMemo(() => {
    const set = new Set<string>();
    regs.forEach((r) => set.add(r.college));
    return Array.from(set).sort();
  }, [regs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regs.filter((r) => {
      if (eventFilter !== 'ALL' && r.event_code !== eventFilter) return false;
      if (collegeFilter !== 'ALL' && r.college !== collegeFilter) return false;
      if (!q) return true;
      return (
        r.participant_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.registration_id.toLowerCase().includes(q) ||
        r.college.toLowerCase().includes(q) ||
        r.mobile.includes(q)
      );
    });
  }, [regs, query, eventFilter, collegeFilter]);

  const eventStats = useMemo(() => {
    const map = new Map<string, number>();
    EVENTS.forEach((e) => map.set(e.code, 0));
    regs.forEach((r) => map.set(r.event_code, (map.get(r.event_code) ?? 0) + 1));
    return map;
  }, [regs]);

  const total = regs.length;
  const totalAnimated = useCountUp(total, 1200, session ?? false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setAuthError(error.message.includes('Invalid login')
        ? 'Invalid email or password.'
        : error.message);
    }
    setAuthLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onBackHome();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', deleteTarget.id);
    if (!error) {
      setRegs((r) => r.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setDeleting(false);
  };

  const exportCsv = () => {
    const rows = filtered.length ? filtered : regs;
    const header = [
      'Registration ID', 'Event', 'Participant Name', 'College', 'Department',
      'Year', 'Email', 'Mobile', 'Team Name', 'Team Leader', 'Team Members', 'Created At',
    ];
    const escape = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const lines = rows.map((r) => {
      const members = (r.team_members ?? [])
        .map((m) => `${m.name} <${m.email}>`)
        .join('; ');
      return [
        r.registration_id,
        r.event_code,
        r.participant_name,
        r.college,
        r.department,
        r.year_of_study,
        r.email,
        r.mobile,
        r.team_name ?? '',
        r.team_leader_name ?? '',
        members,
        new Date(r.created_at).toISOString(),
      ].map(escape).join(',');
    });
    const csv = [header.map(escape).join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `synaltica-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---------- Login screen ----------
  if (session === null) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-pulse text-slate-500"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5 pt-24 pb-16">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-500/40 bg-accent-500/10">
                <ShieldCheck className="h-7 w-7 text-accent-400" />
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold text-white">Admin Sign In</h1>
              <p className="mt-2 text-sm text-slate-400">
                Authorised organisers only. Sign in with your admin credentials.
              </p>
            </div>
            <form onSubmit={signIn} className="mt-7 space-y-4">
              <label className="block">
                <span className="field-label flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-500" /> Email</span>
                <input
                  type="email"
                  className="field-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@srcas.ac.in"
                  required
                />
              </label>
              <label className="block">
                <span className="field-label flex items-center gap-1.5"><Lock className="h-4 w-4 text-slate-500" /> Password</span>
                <input
                  type="password"
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>
              {authError && <p className="field-error">{authError}</p>}
              <button type="submit" disabled={authLoading} className="btn-primary w-full">
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In</>}
              </button>
            </form>
            <button onClick={onBackHome} className="mt-5 w-full text-center text-xs text-slate-500 transition-colors hover:text-slate-300">
              ← Back to website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Dashboard ----------
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container-px">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Registrations Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCsv} className="btn-ghost px-4 py-2.5 text-xs">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={signOut} className="btn-ghost px-4 py-2.5 text-xs">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
              <Users className="h-4 w-4 text-accent-400" /> Total Registrations
            </div>
            <div className="mt-2 font-display text-3xl font-bold text-white">{totalAnimated}</div>
          </div>
          {EVENTS.slice(0, 3).map((e) => (
            <div key={e.code} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
                <TrendingUp className="h-4 w-4 text-accent-400" /> {e.name}
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-white">{eventStats.get(e.code) ?? 0}</div>
            </div>
          ))}
        </div>

        {/* Event-wise breakdown */}
        <div className="mt-4 glass rounded-2xl p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Event-wise Breakdown</h3>
          <div className="mt-4 space-y-3">
            {EVENTS.map((e) => {
              const count = eventStats.get(e.code) ?? 0;
              const pct = total ? (count / total) * 100 : 0;
              return (
                <div key={e.code}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-200">{e.name}</span>
                    <span className="text-slate-400">{count} <span className="text-slate-600">({pct.toFixed(0)}%)</span></span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 glass rounded-2xl p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                className="field-input pl-10"
                placeholder="Search name, email, registration ID, mobile…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select className="field-input" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
              <option value="ALL">All Events</option>
              {EVENTS.map((e) => <option key={e.code} value={e.code}>{e.name}</option>)}
            </select>
            <select className="field-input" value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)}>
              <option value="ALL">All Colleges</option>
              {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          {loadingRegs ? (
            <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : loadError ? (
            <div className="glass rounded-2xl p-6 text-sm text-red-300">{loadError}</div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-sm text-slate-400">No registrations match your filters.</p>
            </div>
          ) : (
            <div className="glass overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-4 font-semibold">Reg ID</th>
                      <th className="px-4 py-4 font-semibold">Participant</th>
                      <th className="px-4 py-4 font-semibold">College</th>
                      <th className="px-4 py-4 font-semibold">Event</th>
                      <th className="px-4 py-4 font-semibold">Team</th>
                      <th className="px-4 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((r) => {
                      const ev = getEventByCode(r.event_code);
                      return (
                        <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-4 py-4 font-mono text-xs text-accent-300">{r.registration_id}</td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-white">{r.participant_name}</div>
                            <div className="text-xs text-slate-500">{r.email}</div>
                          </td>
                          <td className="px-4 py-4 text-slate-300">{r.college}</td>
                          <td className="px-4 py-4">
                            <span className="chip">{ev?.name ?? r.event_code}</span>
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {r.team_name ? <span className="text-white">{r.team_name}</span> : <span className="text-slate-600">—</span>}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelected(r)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                                aria-label="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(r)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                aria-label="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-white/10 px-4 py-3 text-xs text-slate-500">
                Showing {filtered.length} of {regs.length} registrations
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-md animate-fade-in" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-lg animate-fade-up overflow-hidden rounded-t-3xl border border-white/10 bg-ink-900 sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="font-display text-lg font-semibold text-white">Registration Details</h3>
              <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="flex items-center gap-3 rounded-xl border border-accent-500/20 bg-accent-500/5 p-4">
                <span className="font-mono text-lg font-bold text-accent-300">{selected.registration_id}</span>
                <span className="ml-auto text-xs text-slate-500">{new Date(selected.created_at).toLocaleString()}</span>
              </div>
              <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {[
                  ['Name', selected.participant_name],
                  ['Email', selected.email],
                  ['Mobile', `+91 ${selected.mobile}`],
                  ['College', selected.college],
                  ['Department', selected.department],
                  ['Year', selected.year_of_study === 'PG' ? 'Postgraduate' : `Year ${selected.year_of_study}`],
                  ['Event', getEventByCode(selected.event_code)?.name ?? selected.event_code],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-slate-500">{k}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-white break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              {selected.team_name && (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">Team</p>
                  <p className="mt-1.5 text-sm font-semibold text-white">{selected.team_name}</p>
                  {selected.team_leader_name && <p className="mt-0.5 text-xs text-slate-400">Leader · {selected.team_leader_name}</p>}
                  {selected.team_members && selected.team_members.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {selected.team_members.map((m, i) => (
                        <li key={i} className="flex items-center justify-between text-xs text-slate-300">
                          <span>{m.name}</span>
                          <span className="text-slate-500">{m.email}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-5" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-md animate-fade-in" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-sm animate-fade-up rounded-2xl border border-white/10 bg-ink-900 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">Delete registration?</h3>
            <p className="mt-2 text-sm text-slate-400">
              This will permanently remove <span className="text-white">{deleteTarget.participant_name}</span>'s
              registration ({deleteTarget.registration_id}). This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-400 disabled:opacity-60">
                {deleting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
