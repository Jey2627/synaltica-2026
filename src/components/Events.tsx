import { ArrowUpRight, Users } from 'lucide-react';
import { DISPLAY_EVENTS, type SymposiumEvent } from '@/data/events';
import { useReveal } from '@/hooks/useReveal';

interface EventsProps {
  onViewDetails: (code: string) => void;
  onRegister: (code?: string) => void;
}

function EventBanner({ event, onViewDetails, onRegister, index }: { event: SymposiumEvent; onViewDetails: (code: string) => void; onRegister: (code?: string) => void; index: number }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-accent-500/20 bg-ink-900/70 transition-all duration-500 hover:-translate-y-1 hover:border-accent-400/50 hover:shadow-glow" style={{ transitionDelay: `${index * 60}ms` }}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${event.accent} opacity-70 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative grid min-h-[230px] items-center gap-6 p-5 sm:grid-cols-[220px_1fr] sm:p-7 lg:grid-cols-[280px_1fr_auto] lg:gap-10 lg:p-8">
        <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-44 lg:h-40">
          {event.logo ? <img src={event.logo} alt={`${event.name} official logo`} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" /> : <span className="font-display text-2xl font-extrabold tracking-widest text-cyan-300">PIXELPLAY</span>}
        </div>
        <div className="min-w-0">
          <p className="eyebrow">{event.category}</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{event.name}</h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{event.description}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200">
            <Users className="h-3.5 w-3.5 text-accent-400" /> Exactly {event.teamSize} participants
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <button onClick={() => onRegister(event.code)} className="btn-primary min-w-36 px-5 py-3 text-xs">Register Now <ArrowUpRight className="h-3.5 w-3.5" /></button>
          <button onClick={() => onViewDetails(event.code)} className="btn-ghost min-w-36 px-5 py-3 text-xs">View Details</button>
        </div>
      </div>
    </article>
  );
}

export default function Events({ onViewDetails, onRegister }: EventsProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="events" className="relative scroll-mt-24 py-24 sm:py-32">
      <div ref={ref} className="container-px reveal">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our Events</p>
          <h2 className="mt-4 section-title text-balance">Explore Our Events</h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">Five unique challenges. One unforgettable experience.</p>
        </div>
        <div className="mx-auto mt-14 max-w-6xl space-y-5">
          {DISPLAY_EVENTS.map((event, index) => <EventBanner key={event.code} event={event} index={index} onViewDetails={onViewDetails} onRegister={onRegister} />)}
        </div>
      </div>
    </section>
  );
}
