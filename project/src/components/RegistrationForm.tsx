import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Users,
  Trophy,
} from 'lucide-react';
import { EVENTS, TEAM_EVENTS, getEventByCode, type SymposiumEvent } from '@/data/events';
import { generateUniqueRegistrationId, useRegistration, type TeamMember } from '@/lib/registration';
import { isDuplicateError } from '@/lib/registration';

interface RegistrationFormProps {
  preselectedEvent: string | null;
  onBack: () => void;
  onSuccess: (registration: {
    registration_id: string;
    event_code: string;
    participant_name: string;
    college: string;
    department: string;
    year_of_study: string;
    email: string;
    mobile: string;
    team_name?: string | null;
    team_leader_name?: string | null;
    team_members?: TeamMember[];
    created_at?: string;
  }) => void;
}

const YEARS = ['1', '2', '3', '4', 'PG'];

interface FormState {
  event_code: string;
  participant_name: string;
  college: string;
  department: string;
  year_of_study: string;
  email: string;
  mobile: string;
  is_team: boolean;
  team_name: string;
  team_leader_name: string;
  members: TeamMember[];
}

const emptyMember = (): TeamMember => ({ name: '', email: '', college: '', department: '', year: '' });

const initialState = (preselected: string | null): FormState => ({
  event_code: preselected ?? '',
  participant_name: '',
  college: '',
  department: '',
  year_of_study: '',
  email: '',
  mobile: '',
  is_team: false,
  team_name: '',
  team_leader_name: '',
  members: [emptyMember()],
});

export default function RegistrationForm({ preselectedEvent, onBack, onSuccess }: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(() => initialState(preselectedEvent));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { submit } = useRegistration();

  const selectedEvent: SymposiumEvent | undefined = useMemo(
    () => getEventByCode(form.event_code),
    [form.event_code]
  );

  const isTeamEvent = !!selectedEvent && TEAM_EVENTS.has(selectedEvent.code);
  const maxMembers = selectedEvent?.teamSize.max ?? 1;
  const minMembers = selectedEvent?.teamSize.min ?? 1;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const { [key]: _omit, ...rest } = e;
      return rest;
    });
    setServerError(null);
  };

  const handleEventChange = (code: string) => {
    const ev = getEventByCode(code);
    const team = ev ? TEAM_EVENTS.has(ev.code) : false;
    setForm((f) => ({
      ...f,
      event_code: code,
      is_team: team && ev!.teamSize.max > 1,
      members: team ? [emptyMember()] : [],
      team_name: '',
      team_leader_name: '',
    }));
    setErrors({});
    setServerError(null);
  };

  const updateMember = (idx: number, key: keyof TeamMember, value: string) => {
    setForm((f) => {
      const members = [...f.members];
      members[idx] = { ...members[idx], [key]: value };
      return { ...f, members };
    });
  };

  const addMember = () => {
    if (form.members.length >= maxMembers - 1) return; // minus leader (the participant)
    setForm((f) => ({ ...f, members: [...f.members, emptyMember()] }));
  };

  const removeMember = (idx: number) => {
    setForm((f) => ({ ...f, members: f.members.filter((_, i) => i !== idx) }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.event_code) e.event_code = 'Please select an event.';
    if (!form.participant_name.trim()) e.participant_name = 'Name is required.';
    if (!form.college.trim()) e.college = 'College / University is required.';
    if (!form.department.trim()) e.department = 'Department is required.';
    if (!form.year_of_study) e.year_of_study = 'Select your year of study.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required.';
    else if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/[^0-9]/g, ''))) e.mobile = 'Enter a valid 10-digit Indian mobile number.';

    if (form.is_team) {
      if (!form.team_name.trim()) e.team_name = 'Team name is required.';
      if (!form.team_leader_name.trim()) e.team_leader_name = 'Team leader name is required.';
      const memberCount = form.members.filter((m) => m.name.trim()).length;
      const totalTeamSize = memberCount + 1; // leader included
      if (totalTeamSize < minMembers) e.members = `At least ${minMembers - 1} team member(s) required (besides the leader).`;
      if (totalTeamSize > maxMembers) e.members = `Maximum ${maxMembers - 1} additional member(s) allowed.`;
      form.members.forEach((m, i) => {
        if (m.name.trim() || m.email.trim()) {
          if (!m.name.trim()) e[`member_${i}_name`] = 'Required';
          if (!m.email.trim()) e[`member_${i}_email`] = 'Required';
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) e[`member_${i}_email`] = 'Invalid email';
        }
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) {
      const firstErr = document.querySelector('[data-error="true"]');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    try {
      const registration_id = await generateUniqueRegistrationId();
      const cleanMembers = form.is_team
        ? form.members.filter((m) => m.name.trim()).map((m) => ({
            name: m.name.trim(),
            email: m.email.trim().toLowerCase(),
            college: m.college.trim() || form.college.trim(),
            department: m.department.trim() || form.department.trim(),
            year: m.year || form.year_of_study,
          }))
        : [];

      const { data, error } = await submit({
        registration_id,
        event_code: form.event_code,
        participant_name: form.participant_name.trim(),
        college: form.college.trim(),
        department: form.department.trim(),
        year_of_study: form.year_of_study,
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.replace(/[^0-9]/g, ''),
        team_name: form.is_team ? form.team_name.trim() : undefined,
        team_leader_name: form.is_team ? form.team_leader_name.trim() : undefined,
        team_members: cleanMembers,
      });

      if (error) {
        if (isDuplicateError(error.message)) {
          setServerError('A registration already exists for this email in the selected event. Use a different email or choose another event.');
        } else {
          setServerError('Could not complete your registration right now. Please try again in a moment.');
        }
        return;
      }
      if (data) {
        onSuccess({
          registration_id: data.registration_id,
          event_code: data.event_code,
          participant_name: data.participant_name,
          college: data.college,
          department: data.department,
          year_of_study: data.year_of_study,
          email: data.email,
          mobile: data.mobile,
          team_name: data.team_name,
          team_leader_name: data.team_leader_name,
          team_members: (data.team_members as TeamMember[]) ?? [],
          created_at: data.created_at,
        });
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 sm:pt-32">
      <div className="container-px">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Participant Registration</p>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Register for SYNALTICA 2026
            </h1>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
              Complete the form below to secure your spot. Fields marked with{' '}
              <span className="text-accent-400">*</span> are required.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-8" noValidate>
            {/* Event selection */}
            <section className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <Trophy className="h-5 w-5 text-accent-400" /> Select Event
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">Choose one event to register for.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {EVENTS.map((e) => {
                  const active = form.event_code === e.code;
                  return (
                    <button
                      type="button"
                      key={e.code}
                      onClick={() => handleEventChange(e.code)}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{e.name}</div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {e.category} · {e.teamSize.min === e.teamSize.max && e.teamSize.min === 1 ? 'Solo' : `${e.teamSize.min}–${e.teamSize.max} members`}
                        </div>
                      </div>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? 'border-accent-500 bg-accent-500' : 'border-white/20'
                        }`}
                      >
                        {active && <CheckCircle2 className="h-4 w-4 text-ink-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.event_code && <p className="field-error" data-error="true">{errors.event_code}</p>}
            </section>

            {/* Participant details */}
            <section className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <User className="h-5 w-5 text-accent-400" /> Participant Details
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" required error={errors.participant_name} icon={<User className="h-4 w-4" />}>
                  <input
                    className="field-input"
                    value={form.participant_name}
                    onChange={(e) => update('participant_name', e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                  />
                </Field>
                <Field label="College / University" required error={errors.college} icon={<Building2 className="h-4 w-4" />}>
                  <input
                    className="field-input"
                    value={form.college}
                    onChange={(e) => update('college', e.target.value)}
                    placeholder="e.g. Sri Ramakrishna College of Arts and Science"
                  />
                </Field>
                <Field label="Department" required error={errors.department} icon={<GraduationCap className="h-4 w-4" />}>
                  <input
                    className="field-input"
                    value={form.department}
                    onChange={(e) => update('department', e.target.value)}
                    placeholder="e.g. Computer Science with Data Analytics"
                  />
                </Field>
                <Field label="Year of Study" required error={errors.year_of_study} icon={<GraduationCap className="h-4 w-4" />}>
                  <select
                    className="field-input"
                    value={form.year_of_study}
                    onChange={(e) => update('year_of_study', e.target.value)}
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y === 'PG' ? 'Postgraduate' : `Year ${y}`}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Email Address" required error={errors.email} icon={<Mail className="h-4 w-4" />}>
                  <input
                    type="email"
                    className="field-input"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Mobile Number" required error={errors.mobile} icon={<Phone className="h-4 w-4" />}>
                  <input
                    type="tel"
                    className="field-input"
                    value={form.mobile}
                    onChange={(e) => update('mobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </section>

            {/* Team section */}
            {isTeamEvent && (
              <section className="glass rounded-2xl p-6 sm:p-8">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <Users className="h-5 w-5 text-accent-400" /> Team Information
                </h2>
                <p className="mt-1.5 text-sm text-slate-400">
                  {selectedEvent?.name} allows teams of {minMembers}–{maxMembers} members. You are the
                  team leader; add your teammates below.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Team Name" required error={errors.team_name} icon={<Trophy className="h-4 w-4" />}>
                    <input
                      className="field-input"
                      value={form.team_name}
                      onChange={(e) => update('team_name', e.target.value)}
                      placeholder="e.g. The Quant Quartet"
                    />
                  </Field>
                  <Field label="Team Leader Name" required error={errors.team_leader_name} icon={<User className="h-4 w-4" />}>
                    <input
                      className="field-input"
                      value={form.team_leader_name}
                      onChange={(e) => update('team_leader_name', e.target.value)}
                      placeholder="Team leader's full name"
                    />
                  </Field>
                </div>

                {/* Team members */}
                <div className="mt-7">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
                      Team Members
                    </h3>
                    {form.members.length < maxMembers - 1 && (
                      <button
                        type="button"
                        onClick={addMember}
                        className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1.5 text-xs font-semibold text-accent-300 transition-colors hover:bg-accent-500/20"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add member
                      </button>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    {form.members.map((m, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-ink-800/40 p-4 sm:p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Member {i + 2}
                          </span>
                          {form.members.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMember(i)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-400/80 transition-colors hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Full Name" required={!!m.email || !!m.name} error={errors[`member_${i}_name`]} icon={<User className="h-4 w-4" />}>
                            <input
                              className="field-input"
                              value={m.name}
                              onChange={(e) => updateMember(i, 'name', e.target.value)}
                              placeholder="Member name"
                            />
                          </Field>
                          <Field label="Email" required={!!m.name || !!m.email} error={errors[`member_${i}_email`]} icon={<Mail className="h-4 w-4" />}>
                            <input
                              type="email"
                              className="field-input"
                              value={m.email}
                              onChange={(e) => updateMember(i, 'email', e.target.value)}
                              placeholder="member@example.com"
                            />
                          </Field>
                          <Field label="College (optional)" icon={<Building2 className="h-4 w-4" />}>
                            <input
                              className="field-input"
                              value={m.college}
                              onChange={(e) => updateMember(i, 'college', e.target.value)}
                              placeholder="Defaults to your college"
                            />
                          </Field>
                          <Field label="Department (optional)" icon={<GraduationCap className="h-4 w-4" />}>
                            <input
                              className="field-input"
                              value={m.department}
                              onChange={(e) => updateMember(i, 'department', e.target.value)}
                              placeholder="Defaults to your department"
                            />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.members && <p className="field-error mt-2" data-error="true">{errors.members}</p>}
                </div>
              </section>
            )}

            {serverError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300" data-error="true">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={onBack} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary sm:px-8">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block" data-error={error ? 'true' : undefined}>
      <span className="field-label flex items-center gap-1.5">
        {icon && <span className="text-slate-500">{icon}</span>}
        {label}
        {required && <span className="text-accent-400">*</span>}
      </span>
      {children}
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}
