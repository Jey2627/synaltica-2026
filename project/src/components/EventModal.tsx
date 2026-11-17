import { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { X, Users, Tag, ArrowRight, Calendar, FileText } from 'lucide-react';
import { getEventByCode } from '@/data/events';

interface EventModalProps {
  code: string | null;
  onClose: () => void;
  onRegister: (code: string) => void;
}

export default function EventModal({ code, onClose, onRegister }: EventModalProps) {
  useEffect(() => {
    if (!code) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [code, onClose]);

  if (!code) return null;
  const event = getEventByCode(code);
  if (!event) return null;

  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[event.icon] ?? Icons.Sparkles;
  const teamLabel =
    event.teamSize.min === event.teamSize.max
      ? event.teamSize.min === 1
        ? 'Solo participation'
        : `${event.teamSize.min} members per team`
      : `${event.teamSize.min}–${event.teamSize.max} members per team`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg animate-fade-up overflow-hidden rounded-t-3xl border border-white/10 bg-ink-900 sm:rounded-3xl">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${event.accent}`} />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
              <Icon className="h-7 w-7" />
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {event.name}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-accent-300">{event.tagline}</p>

          <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-300">{event.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Tag className="h-3.5 w-3.5" /> Category
              </div>
              <div className="mt-1.5 text-sm font-semibold text-white">{event.category}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="h-3.5 w-3.5" /> Team Size
              </div>
              <div className="mt-1.5 text-sm font-semibold text-white">{teamLabel}</div>
            </div>
          </div>

          <div className="mt-4 glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FileText className="h-3.5 w-3.5" /> Detailed Rulebook
            </div>
            <div className="mt-1.5 text-sm text-slate-300">
              The complete rulebook, judging criteria and schedule for {event.name} will be
              published here once officially confirmed by the organising committee.
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" /> Symposium date · 9 December 2026
          </div>

          <button onClick={() => onRegister(event.code)} className="btn-primary mt-6 w-full">
            Register for {event.name}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
