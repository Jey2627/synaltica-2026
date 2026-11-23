import { useEffect, useMemo, useState } from 'react';

const TARGET = new Date('2026-12-09T00:00:00+05:30').getTime();

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffParts(ms: number): TimeParts {
  const clamped = Math.max(0, ms);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => n.toString().padStart(2, '0');

export default function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = useMemo(() => diffParts(TARGET - now), [now]);
  const isLive = TARGET - now <= 0;

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ];

  return (
    <div className="mx-auto mt-12 max-w-2xl animate-fade-up [animation-delay:480ms]">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {isLive ? 'The symposium has begun' : 'Symposium begins in'}
      </p>
      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((u) => (
          <div
            key={u.label}
            className="glass relative overflow-hidden rounded-2xl px-2 py-5 text-center sm:px-4 sm:py-6"
          >
            <div
              className={`font-display text-3xl font-bold tabular-nums tracking-tight text-white sm:text-5xl ${
                mounted ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-700`}
            >
              {pad(u.value)}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
