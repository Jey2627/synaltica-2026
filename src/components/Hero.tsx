import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import Countdown from '@/components/Countdown';

interface HeroProps {
  onRegister: () => void;
  onExplore: () => void;
}

export default function Hero({ onRegister, onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-44">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute -left-32 top-32 h-72 w-72 animate-float-slow rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute -right-32 top-64 h-80 w-80 animate-float-slow rounded-full bg-emerald-700/10 blur-3xl [animation-delay:1.5s]" />
      </div>

      <div className="container-px">
        <div className="mx-auto max-w-4xl text-center">
          <p className="animate-fade-up font-display text-2xl font-extrabold uppercase leading-snug tracking-[0.06em] text-gold-300 sm:text-4xl lg:text-5xl [animation-delay:80ms]">Sri Ramakrishna College of Arts &amp; Science</p>
          <p className="mt-4 animate-fade-up text-base font-semibold tracking-wide text-slate-200 sm:text-xl [animation-delay:110ms]">Department of Computer Science with Data Analytics</p>
          <p className="mt-6 animate-fade-up text-sm font-semibold uppercase tracking-[0.4em] text-accent-400 sm:text-base [animation-delay:140ms]">Proudly Presents</p>
          <h1 className="mt-4 animate-fade-up font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl [animation-delay:120ms]">SYNALTICA <span className="shimmer-text">2026</span></h1>
          <p className="mt-5 animate-fade-up text-sm font-semibold uppercase tracking-[0.35em] text-slate-300 sm:text-base [animation-delay:200ms]">Inter-Collegiate Technical Symposium</p>
          <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-pretty text-base leading-relaxed text-slate-400 sm:text-lg [animation-delay:280ms]">A premium technical symposium bringing together curious minds to compete, create and register for five focused event challenges.</p>

          <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3 text-sm text-slate-300 [animation-delay:340ms]">
            <span className="chip"><CalendarDays className="h-3.5 w-3.5 text-accent-400" /> 9 December 2026</span>
            <span className="chip"><MapPin className="h-3.5 w-3.5 text-accent-400" /> SRCAS Campus</span>
          </div>

          <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:420ms]">
            <button onClick={onRegister} className="btn-primary w-full sm:w-auto">Register Now <ArrowRight className="h-4 w-4" /></button>
            <button onClick={onExplore} className="btn-ghost w-full sm:w-auto">Explore Events</button>
          </div>

          <Countdown />
        </div>

        <div className="mx-auto mt-16 max-w-4xl animate-fade-up [animation-delay:520ms]">
          <div className="glass grid grid-cols-3 divide-x divide-white/10 rounded-2xl">
            {[
              { value: '5', label: 'Flagship Events' },
              { value: '2026', label: 'Edition' },
              { value: 'CSDA', label: 'Organising Department' },
            ].map((stat) => (
              <div key={stat.label} className="px-3 py-6 text-center sm:px-6 sm:py-7">
                <div className="font-display text-xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400 sm:text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
