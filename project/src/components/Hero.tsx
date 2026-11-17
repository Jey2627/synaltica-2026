import { CalendarDays, ArrowRight, Sparkles, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroProps {
  onRegister: () => void;
  onExplore: () => void;
}

const EVENT_START = new Date('2026-12-09T00:00:00+05:30').getTime();

function Countdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, EVENT_START - Date.now()));
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, EVENT_START - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const totalSeconds = Math.floor(remaining / 1000);
  const values = [
    { label: 'Days', value: Math.floor(totalSeconds / 86400) },
    { label: 'Hours', value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: 'Minutes', value: Math.floor((totalSeconds % 3600) / 60) },
    { label: 'Seconds', value: totalSeconds % 60 },
  ];
  return (
    <div className="mx-auto mt-9 max-w-xl">
      <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        <Clock3 className="h-4 w-4 text-accent-400" /> Countdown to the symposium
      </div>
      <div className="glass grid grid-cols-4 gap-2 rounded-2xl p-3 sm:gap-4 sm:p-5">
        {values.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-1 py-3 text-center sm:py-4">
            <div className="font-display text-2xl font-bold tabular-nums text-white sm:text-4xl">{String(item.value).padStart(2, '0')}</div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">{item.label}</div>
          </div>
        ))}
      </div>
      {remaining === 0 && <p className="mt-2 text-center text-xs text-accent-300">The symposium day has arrived.</p>}
    </div>
  );
}

export default function Hero({ onRegister, onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-44">
      {/* Tech-inspired background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute -left-32 top-32 h-72 w-72 animate-float-slow rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute -right-32 top-64 h-80 w-80 animate-float-slow rounded-full bg-gold-500/5 blur-3xl [animation-delay:1.5s]" />
      </div>

      <div className="container-px">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <span className="chip mx-auto">
              <Sparkles className="h-3.5 w-3.5 text-accent-400" />
              Department of Computer Science with Data Analytics
            </span>
          </div>

          <p className="mt-6 animate-fade-up eyebrow [animation-delay:80ms]">
            Sri Ramakrishna College of Arts and Science
          </p>

          <h1 className="mt-5 animate-fade-up font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl [animation-delay:120ms]">
            SYNALTICA
            <span className="ml-3 shimmer-text">2026</span>
          </h1>

          <p className="mt-5 animate-fade-up text-sm font-semibold uppercase tracking-[0.4em] text-slate-300 sm:text-base [animation-delay:200ms]">
            Inter-Collegiate Technical Symposium
          </p>

          <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-pretty text-base leading-relaxed text-slate-400 sm:text-lg [animation-delay:280ms]">
            Choose your challenge, complete your registration and get ready to be part of SYNALTICA 2026.
          </p>

          <div className="mt-8 flex animate-fade-up items-center justify-center text-sm text-slate-300 [animation-delay:340ms]">
            <span className="chip"><CalendarDays className="h-3.5 w-3.5 text-accent-400" />9 December 2026</span>
          </div>
          <Countdown />

          <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:420ms]">
            <button onClick={onRegister} className="btn-primary w-full sm:w-auto">
              Register Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onExplore} className="btn-ghost w-full sm:w-auto">
              Explore Events
            </button>
          </div>
        </div>

        {/* Floating stat strip */}
        <div className="mx-auto mt-16 max-w-4xl animate-fade-up [animation-delay:520ms]">
          <div className="glass grid grid-cols-3 divide-x divide-white/10 rounded-2xl">
            {[
              { k: '5', v: 'Flagship Events' },
              { k: '2026', v: 'Edition' },
              { k: 'CSDA', v: 'Organising Dept.' },
            ].map((s, i) => (
              <div key={i} className="px-4 py-6 text-center sm:py-7">
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-slate-400 sm:text-sm">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
