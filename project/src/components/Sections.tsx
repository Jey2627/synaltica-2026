import { CalendarCheck, Clock, Building2, Phone, Mail } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const highlights = [
  { k: 'Live Competition', v: 'Real-time judging across all five events.' },
  { k: 'Peer Networking', v: 'Meet students and faculty from invited institutions.' },
  { k: 'Certified Participation', v: 'Every registered participant receives a certificate.' },
  { k: 'Awards & Recognition', v: 'Winners and runners-up recognised on stage.' },
];

export function Highlights() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="highlights" className="relative scroll-mt-24 py-24 sm:py-32">
      <div ref={ref} className="container-px reveal">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Symposium Highlights</p>
          <h2 className="mt-4 section-title text-balance">A day engineered for impact.</h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 transition-colors duration-300 hover:border-accent-500/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-white">{h.k}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{h.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const dates = [
  { label: 'Registration Opens', value: 'Open Now', icon: Clock, accent: 'text-accent-400' },
  { label: 'Registration Closes', value: '5 December 2026', icon: CalendarCheck, accent: 'text-gold-400' },
  { label: 'Symposium Date', value: '9 December 2026', icon: CalendarCheck, accent: 'text-accent-400' },
  { label: 'Reporting Time', value: '08:30 AM IST', icon: Clock, accent: 'text-slate-300' },
];

export function ImportantDates() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="dates" className="relative scroll-mt-24 py-24 sm:py-32">
      <div ref={ref} className="container-px reveal">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Important Dates</p>
          <h2 className="mt-4 section-title text-balance">Mark your calendar.</h2>
        </div>
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="glass overflow-hidden rounded-3xl">
            <div className="divide-y divide-white/10">
              {dates.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02] sm:px-8"
                >
                  <div className="flex items-center gap-4">
                    <d.icon className={`h-5 w-5 ${d.accent}`} />
                    <span className="text-sm font-medium text-slate-300 sm:text-base">{d.label}</span>
                  </div>
                  <span className="font-display text-sm font-semibold text-white sm:text-base">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            Venue details will be published once officially confirmed by the organising committee.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div ref={ref} className="container-px reveal">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Contact & Organising Department</p>
          <h2 className="mt-4 section-title text-balance">Questions? Reach the organising team.</h2>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass rounded-2xl p-6 text-center">
              <Building2 className="mx-auto h-6 w-6 text-accent-400" />
              <p className="mt-4 text-sm font-semibold text-white">Organising Department</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                Department of Computer Science with Data Analytics (CSDA)
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <Mail className="mx-auto h-6 w-6 text-accent-400" />
              <p className="mt-4 text-sm font-semibold text-white">Email</p>
              <p className="mt-1.5 text-sm text-slate-400">synaltica2026@srcas.ac.in</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <Phone className="mx-auto h-6 w-6 text-accent-400" />
              <p className="mt-4 text-sm font-semibold text-white">Institution</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                Sri Ramakrishna College of Arts and Science, Coimbatore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
