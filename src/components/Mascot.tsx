import { useEffect, useState } from 'react';

type Page = 'home' | 'register' | 'success' | 'admin';
type Phase = 'portal' | 'emerge' | 'greet' | 'fly' | 'perch';

const MASCOT_SRC = '/assets/mascot/mascot.png';
const SEEN_KEY = 'synaltica-mascot-intro-seen';

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Session storage may be unavailable; the animation can still complete.
  }
}

export default function MascotLayer({ page }: { page: Page }) {
  const [phase, setPhase] = useState<Phase>(() =>
    page === 'home' && !hasSeenIntro() &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'portal'
      : 'perch',
  );

  useEffect(() => {
    if (phase === 'perch' || page !== 'home') return;
    const next: Record<Exclude<Phase, 'perch'>, { phase: Phase; delay: number }> = {
      portal: { phase: 'emerge', delay: 650 },
      emerge: { phase: 'greet', delay: 1150 },
      greet: { phase: 'fly', delay: 2300 },
      fly: { phase: 'perch', delay: 1250 },
    };
    const step = next[phase as Exclude<Phase, 'perch'>];
    const timer = window.setTimeout(() => {
      setPhase(step.phase);
      if (step.phase === 'perch') markIntroSeen();
    }, step.delay);
    return () => window.clearTimeout(timer);
  }, [phase, page]);

  if (page === 'admin' || page === 'success') return null;

  if (phase === 'perch') {
    return (
      <div className="syn-mascot-perch" aria-label="SYNALTICA mascot">
        <img src={MASCOT_SRC} alt="SYNALTICA robot mascot" />
      </div>
    );
  }

  return (
    <div className={`syn-mascot-intro syn-phase-${phase}`} role="status" aria-live="polite">
      <div className="syn-portal" aria-hidden="true">
        <span /><span /><span />
      </div>
      <img className="syn-mascot-intro-img" src={MASCOT_SRC} alt="SYNALTICA robot mascot" />
      {phase === 'greet' && (
        <div className="syn-mascot-welcome">
          <span>Welcome to the Department of CSDA</span>
          <strong>SYNALTICA 2026</strong>
        </div>
      )}
      <button
        className="syn-mascot-skip"
        onClick={() => {
          markIntroSeen();
          setPhase('perch');
        }}
      >
        Skip intro
      </button>
    </div>
  );
}

export function MascotWish() {
  return (
    <div className="syn-mascot-wish">
      <img src={MASCOT_SRC} alt="SYNALTICA robot mascot" />
      <div className="syn-mascot-wish-bubble">
        <strong>All the best!</strong>
        <span>See you at SYNALTICA 2026</span>
      </div>
    </div>
  );
}
