import { CheckCircle2, Copy, Check, ArrowRight, Home, Calendar } from 'lucide-react';
import { useState } from 'react';
import { getEventByCode } from '@/data/events';
import type { TeamMember } from '@/lib/registration';
import { MascotWish } from '@/components/Mascot';

export interface SuccessRegistration {
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
}

interface SuccessPageProps {
  registration: SuccessRegistration;
  onHome: () => void;
  onRegisterAnother: () => void;
}

export default function RegistrationSuccess({
  registration,
  onHome,
  onRegisterAnother,
}: SuccessPageProps) {
  const [copied, setCopied] = useState(false);
  const event = getEventByCode(registration.event_code);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(registration.registration_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const details: { label: string; value: string }[] = [
    { label: 'Participant', value: registration.participant_name },
    { label: 'College / University', value: registration.college },
    { label: 'Department', value: registration.department },
    { label: 'Year of Study', value: registration.year_of_study === 'PG' ? 'Postgraduate' : `Year ${registration.year_of_study}` },
    { label: 'Email', value: registration.email },
    { label: 'Mobile', value: `+91 ${registration.mobile}` },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 sm:pt-32">
      <div className="container-px">
        <div className="mx-auto max-w-2xl">
          <MascotWish />
          {/* Confirmation header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-500/40 bg-accent-500/10 animate-fade-up">
              <CheckCircle2 className="h-9 w-9 text-accent-400" />
            </div>
            <p className="mt-6 eyebrow animate-fade-up [animation-delay:80ms]">Registration Confirmed</p>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl animate-fade-up [animation-delay:140ms]">
              You're registered for SYNALTICA 2026
            </h1>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-400 sm:text-base animate-fade-up [animation-delay:200ms]">
              Save your registration ID — you'll need it on the day of the symposium. A confirmation
              has been recorded against your email.
            </p>
          </div>

          {/* Registration ID card */}
          <div className="mt-10 animate-fade-up [animation-delay:260ms]">
            <div className="glass-strong overflow-hidden rounded-3xl">
              <div className="bg-gradient-to-r from-accent-500/15 to-transparent px-6 py-5 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-400">
                  Your Registration ID
                </p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="font-mono text-2xl font-bold tracking-wider text-white sm:text-3xl">
                    {registration.registration_id}
                  </span>
                  <button
                    onClick={copyId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-accent-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                <div className="bg-ink-900/80 px-6 py-5 sm:px-8">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Selected Event</p>
                  <p className="mt-1.5 font-display text-lg font-semibold text-white">{event?.name ?? registration.event_code}</p>
                  <p className="mt-0.5 text-xs text-accent-300">{event?.category}</p>
                </div>
                <div className="bg-ink-900/80 px-6 py-5 sm:px-8">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Symposium Date</p>
                  <p className="mt-1.5 flex items-center gap-2 font-display text-lg font-semibold text-white">
                    <Calendar className="h-4 w-4 text-accent-400" /> 9 December 2026
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Participant Details</p>
                <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {details.map((d) => (
                    <div key={d.label}>
                      <dt className="text-xs text-slate-500">{d.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-white break-words">{d.value}</dd>
                    </div>
                  ))}
                </dl>

                {registration.team_name && (
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">Team</p>
                    <p className="mt-1.5 text-sm font-semibold text-white">{registration.team_name}</p>
                    {registration.team_leader_name && (
                      <p className="mt-0.5 text-xs text-slate-400">Leader · {registration.team_leader_name}</p>
                    )}
                    {registration.team_members && registration.team_members.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {registration.team_members.map((m, i) => (
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

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center animate-fade-up [animation-delay:340ms]">
            <button onClick={onRegisterAnother} className="btn-primary">
              Register for Another Event
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onHome} className="btn-ghost">
              <Home className="h-4 w-4" /> Back to Home
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Please carry a valid college ID and a screenshot of this confirmation on the day of the symposium.
          </p>
        </div>
      </div>
    </div>
  );
}
