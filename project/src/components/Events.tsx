import * as Icons from 'lucide-react';
import { ArrowUpRight, Users, Tag } from 'lucide-react';
import { EVENTS, type SymposiumEvent } from '@/data/events';
import { useReveal } from '@/hooks/useReveal';

interface EventsProps {
  onViewDetails: (code: string) => void;
  onRegister: (code?: string) => void;
}

function EventCard({
  event,
  onViewDetails,
  onRegister,
  index,
}: {
  event: SymposiumEvent;
  onViewDetails: (code: string) => void;
  onRegister: (code?: string) => void;
  index: number;
}) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[event.icon] ?? Icons.Sparkles;
  const teamLabel =
    event.teamSize.min === event.teamSize.max
      ? event.teamSize.min === 1
        ? 'Solo'
        : `${event.teamSize.min} members`
      : `${event.teamSize.min}–${event.teamSize.max} members`;

  return (
    <div
      className={`reveal group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/40 p-px transition-all duration-500 hover:border-white/20`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${event.accent} opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-ink-900/80 p-6 backdrop-blur-xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
            <Icon className="h-6 w-6" />
          </div>
          <span className="chip">
            <Tag className="h-3 w-3" />
            {event.category}
          </span>
        </div>

        <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          {event.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-accent-300">{event.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{event.description}</p>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <Users className="h-3.5 w-3.5 text-slate-500" />
          Team size · <span className="text-slate-200">{teamLabel}</span>
        </div>

        <div className="mt-6 flex items-center gap-3 pt-1">
          <button
            onClick={() => onViewDetails(event.code)}
            className="btn-ghost flex-1 px-4 py-2.5 text-xs"
          >
            View Details
          </button>
          <button
            onClick={() => onRegister(event.code)}
            className="btn-primary flex-1 px-4 py-2.5 text-xs"
          >
            Register
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Events({ onViewDetails, onRegister }: EventsProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="events" className="relative scroll-mt-24 py-24 sm:py-32">
      <div ref={ref} className="container-px reveal">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Flagship Events</p>
          <h2 className="mt-4 section-title text-balance">Choose your event. Register your team.</h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
            Explore the five events below and complete your registration in a few simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e, i) => (
            <EventCard
              key={e.code}
              event={e}
              index={i}
              onViewDetails={onViewDetails}
              onRegister={onRegister}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
