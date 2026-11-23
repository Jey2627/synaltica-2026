import { useMemo, useState, type FormEvent, type ReactNode, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { DISPLAY_EVENTS, getEventByCode, type SymposiumEvent } from '@/data/events';
import { generateUniqueRegistrationId, isDuplicateError, useRegistration, type TeamMember } from '@/lib/registration';

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
    team_name: string;
    team_leader_name: string;
    team_members: TeamMember[];
    created_at?: string;
  }) => void;
}

const YEARS = ['1', '2', '3', '4', 'PG'];

type LeaderFields = {
  participant_name: string;
  mobile: string;
  email: string;
  department: string;
  year_of_study: string;
};

type FormState = {
  event_code: string;
  team_name: string;
  college: string;
  leader: LeaderFields;
  members: TeamMember[];
};

const emptyMember = (): TeamMember => ({
  name: '',
  mobile: '',
  email: '',
  college: '',
  department: '',
  year: '',
});

const emptyLeader = (): LeaderFields => ({
  participant_name: '',
  mobile: '',
  email: '',
  department: '',
  year_of_study: '',
});

const membersForEvent = (code: string): TeamMember[] => {
  const event = getEventByCode(code);
  return event ? Array.from({ length: Math.max(0, event.teamSize - 1) }, emptyMember) : [];
};

const initialState = (preselectedEvent: string | null): FormState => ({
  event_code: preselectedEvent ?? '',
  team_name: '',
  college: '',
  leader: emptyLeader(),
  members: preselectedEvent ? membersForEvent(preselectedEvent) : [],
});

export default function RegistrationForm({ preselectedEvent, onBack, onSuccess }: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(() => initialState(preselectedEvent));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const target = document.getElementById(preselectedEvent ? 'team-details' : 'select-event');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { submit } = useRegistration();

  const selectedEvent: SymposiumEvent | undefined = useMemo(
    () => getEventByCode(form.event_code),
    [form.event_code]
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    clearError(key);
  };

  const clearError = (key: string) => {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setServerError(null);
  };

  const updateLeader = (key: keyof LeaderFields, value: string) => {
    setForm((current) => ({ ...current, leader: { ...current.leader, [key]: value } }));
    const errorKey = key === 'participant_name' ? 'name' : key === 'year_of_study' ? 'year' : key;
    clearError(`leader_${errorKey}`);
  };

  const updateMember = (index: number, key: keyof TeamMember, value: string) => {
    setForm((current) => {
      const members = [...current.members];
      members[index] = { ...members[index], [key]: value };
      return { ...current, members };
    });
    clearError(`member_${index}_${key}`);
  };

  const handleEventChange = (event_code: string) => {
    setForm((current) => ({
      ...current,
      event_code,
      members: membersForEvent(event_code),
    }));
    setErrors({});
    setServerError(null);
  };

  const validatePerson = (
    person: { name: string; mobile: string; email: string; department: string; year: string },
    prefix: string,
    result: Record<string, string>,
  ) => {
    if (!person.name.trim()) result[`${prefix}_name`] = 'Required';
    if (!person.mobile.trim()) result[`${prefix}_mobile`] = 'Required';
    else if (!/^[6-9]\d{9}$/.test(person.mobile.replace(/[^0-9]/g, ''))) result[`${prefix}_mobile`] = 'Enter a valid mobile number.';
    if (!person.email.trim()) result[`${prefix}_email`] = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email.trim())) result[`${prefix}_email`] = 'Enter a valid email address.';
    if (!person.department.trim()) result[`${prefix}_department`] = 'Required';
    if (!person.year) result[`${prefix}_year`] = 'Required';
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.event_code) next.event_code = 'Select an event.';
    if (!form.team_name.trim()) next.team_name = 'Required';
    if (!form.college.trim()) next.college = 'Required';

    validatePerson(
      {
        name: form.leader.participant_name,
        mobile: form.leader.mobile,
        email: form.leader.email,
        department: form.leader.department,
        year: form.leader.year_of_study,
      },
      'leader',
      next,
    );

    form.members.forEach((member, index) => {
      validatePerson(member, `member_${index}`, next);
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    if (!validate()) {
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const registration_id = await generateUniqueRegistrationId();
      const cleanMembers = form.members.map((member) => ({
        name: member.name.trim(),
        mobile: member.mobile.replace(/[^0-9]/g, ''),
        email: member.email.trim().toLowerCase(),
        college: form.college.trim(),
        department: member.department.trim(),
        year: member.year,
      }));

      const { data, error } = await submit({
        registration_id,
        event_code: form.event_code,
        participant_name: form.leader.participant_name.trim(),
        college: form.college.trim(),
        department: form.leader.department.trim(),
        year_of_study: form.leader.year_of_study,
        email: form.leader.email.trim().toLowerCase(),
        mobile: form.leader.mobile.replace(/[^0-9]/g, ''),
        team_name: form.team_name.trim(),
        team_leader_name: form.leader.participant_name.trim(),
        team_members: cleanMembers,
      });

      if (error) {
        setServerError(
          isDuplicateError(error.message)
            ? 'A registration already exists for this email in the selected event.'
            : 'Could not complete the registration right now. Please try again.',
        );
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
          team_name: data.team_name ?? '',
          team_leader_name: data.team_leader_name ?? data.participant_name,
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
    <div className="min-h-screen pb-24 pt-24 sm:pt-32">
      <div className="container-px">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="eyebrow">Participant Registration</p>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Register for SYNALTICA 2026</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">Complete every required field to submit your team registration.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
            <section id="select-event" className="scroll-mt-24 glass rounded-2xl p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white"><Trophy className="h-5 w-5 text-accent-400" /> Select Event</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DISPLAY_EVENTS.map((event) => {
                  const active = form.event_code === event.code;
                  return (
                    <button type="button" key={event.code} onClick={() => handleEventChange(event.code)} className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all ${active ? 'border-accent-500 bg-accent-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
                      <div><div className="text-sm font-semibold text-white">{event.name}</div><div className="mt-1 text-xs text-slate-400">Exactly {event.teamSize} participants</div></div>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? 'border-accent-500 bg-accent-500' : 'border-white/20'}`}>{active && <CheckCircle2 className="h-4 w-4 text-ink-950" />}</span>
                    </button>
                  );
                })}
              </div>
              {errors.event_code && <p className="field-error" data-error="true">{errors.event_code}</p>}
            </section>

            <section id="team-details" className="scroll-mt-24 glass rounded-2xl p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white"><Users className="h-5 w-5 text-accent-400" /> Team Details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Team Name" required error={errors.team_name} icon={<Trophy className="h-4 w-4" />}>
                  <input className="field-input" value={form.team_name} onChange={(event) => update('team_name', event.target.value)} />
                </Field>
                <Field label="College Name" required error={errors.college} icon={<Building2 className="h-4 w-4" />}>
                  <input className="field-input" value={form.college} onChange={(event) => update('college', event.target.value)} />
                </Field>
              </div>
            </section>

            <ParticipantSection
              title="Team Leader"
              name={form.leader.participant_name}
              mobile={form.leader.mobile}
              email={form.leader.email}
              department={form.leader.department}
              year={form.leader.year_of_study}
              errors={errors}
              prefix="leader"
              onChange={(key, value) => updateLeader(key === 'name' ? 'participant_name' : key === 'year' ? 'year_of_study' : key, value)}
            />

            {selectedEvent && form.members.map((member, index) => (
              <ParticipantSection
                key={`${selectedEvent.code}-${index}`}
                title={`Participant ${index + 2}`}
                name={member.name}
                mobile={member.mobile}
                email={member.email}
                department={member.department}
                year={member.year}
                errors={errors}
                prefix={`member_${index}`}
                onChange={(key, value) => updateMember(index, key === 'name' ? 'name' : key, value)}
              />
            ))}

            {serverError && <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300" data-error="true"><AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" /><p>{serverError}</p></div>}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={onBack} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Cancel</button>
              <button type="submit" disabled={submitting || !selectedEvent} className="btn-primary sm:px-8">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Complete Registration <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ParticipantSection({
  title,
  name,
  mobile,
  email,
  department,
  year,
  errors,
  prefix,
  onChange,
}: {
  title: string;
  name: string;
  mobile: string;
  email: string;
  department: string;
  year: string;
  errors: Record<string, string>;
  prefix: string;
  onChange: (key: 'name' | 'mobile' | 'email' | 'department' | 'year', value: string) => void;
}) {
  return (
    <section className="glass rounded-2xl p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white"><User className="h-5 w-5 text-accent-400" /> {title}</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={errors[`${prefix}_name`]} icon={<User className="h-4 w-4" />}>
          <input className="field-input" value={name} onChange={(event) => onChange('name', event.target.value)} />
        </Field>
        <Field label="Mobile Number" required error={errors[`${prefix}_mobile`]} icon={<Phone className="h-4 w-4" />}>
          <input className="field-input" type="tel" inputMode="numeric" maxLength={10} value={mobile} onChange={(event) => onChange('mobile', event.target.value)} />
        </Field>
        <Field label="Email Address" required error={errors[`${prefix}_email`]} icon={<Mail className="h-4 w-4" />}>
          <input className="field-input" type="email" value={email} onChange={(event) => onChange('email', event.target.value)} />
        </Field>
        <Field label="Department" required error={errors[`${prefix}_department`]} icon={<GraduationCap className="h-4 w-4" />}>
          <input className="field-input" value={department} onChange={(event) => onChange('department', event.target.value)} />
        </Field>
        <Field label="Year of Study" required error={errors[`${prefix}_year`]} icon={<GraduationCap className="h-4 w-4" />}>
          <select className="field-input" value={year} onChange={(event) => onChange('year', event.target.value)}>
            <option value="">Select year</option>
            {YEARS.map((item) => <option key={item} value={item}>{item === 'PG' ? 'Postgraduate' : `Year ${item}`}</option>)}
          </select>
        </Field>
      </div>
    </section>
  );
}

function Field({ label, required, error, icon, children }: { label: string; required?: boolean; error?: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <label className="block" data-error={error ? 'true' : undefined}>
      <span className="field-label flex items-center gap-1.5">{icon && <span className="text-slate-500">{icon}</span>}{label}{required && <span className="text-accent-400">*</span>}</span>
      {children}
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}
