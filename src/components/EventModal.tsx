import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, FileText, MapPin, UserCheck, Users, X } from 'lucide-react';
import { getEventByCode } from '@/data/events';

interface EventModalProps {
  code: string | null;
  onClose: () => void;
  onRegister: (code: string) => void;
}

interface EventInfo {
  rounds: string[];
  rules: string[];
  judging: string[];
  year2: string[];
  year1: string[];
}

const info: Record<string, EventInfo> = {
  DATA_HUNT: {
    rounds: [
      'Teams receive clues one after another.',
      'Each clue leads to the next location or challenge.',
      'Solve all clues in the correct sequence.',
      'The first team to complete the hunt wins.',
    ],
    rules: [
      'Both team members must participate actively.',
      'Do not share clues or answers with other teams.',
      'Searching in restricted areas or damaging college property is prohibited.',
      'Follow the coordinators’ instructions; their decision is final.',
    ],
    judging: ['Correct completion of all clues.', 'Accuracy of answers.', 'Minimum time taken.'],
    year2: ['Nitesh Kumar', 'Nikita Basnet'],
    year1: ['Mithra S S', 'Thomas Edwin M', 'Sangeetha J'],
  },
  TECHNOVA: {
    rounds: [
      'Round 1 – Brain Connect: quiz, 25 questions per team; top 5 teams qualify.',
      'Round 2 – Word Connect: guess the secret word from your teammate’s hints.',
      'Round 3 – Tech & Arrange: find hidden word slips, arrange the sentence and answer a technical question.',
    ],
    rules: [],
    judging: [
      'Round 1: no points; top 5 teams qualify.',
      'Round 2: 10 points per correct word.',
      'Round 3: points for completing both challenges.',
    ],
    year2: ['Anaga R', 'Jeevika R'],
    year1: ['Kanishka S', 'Barath Priyan S', 'Sabrish S'],
  },
  IDEATHON: {
    rounds: [
      'Round 1 – Theme Reveal & Ideation (theme revealed on the spot).',
      'Round 2 – Solution Development.',
      'Round 3 – Final Pitch & Evaluation.',
    ],
    rules: [],
    judging: [
      'Total judging score: 100 marks.',
      'Highest cumulative score wins.',
      'Tie-breaker: Innovation & Creativity, then Feasibility & Practicality.',
    ],
    year2: ['Ilakiya P', 'Rishab P'],
    year1: ['Raja Sree P', 'Umapathi I', 'Monika R'],
  },
  PROMPT_BATTLE: {
    rounds: [
      'Round 1 – Image Recreation: recreate a reference image using prompts.',
      'Round 2 – Concept-Based Image Creation: generate an original image from a given concept.',
    ],
    rules: [
      'Exactly 2 participants per team.',
      'Only AI image-generation tools permitted by the organisers may be used.',
      'Time limits will be announced before each round.',
    ],
    judging: ['Creativity, accuracy and overall execution.'],
    year2: ['Bavatharani M', 'Singarasu S'],
    year1: ['Yasotha K', 'Karna S', 'Kreesha S S'],
  },
  PIXELPLAY: {
    rounds: [
      'Round 1 – Creative Logo Creation: design an original logo with a slogan/tagline in Canva.',
      'Round 2 – Creative Poster Designing: design a technical poster in Canva on a topic announced on the spot (portrait only).',
    ],
    rules: [
      'Exactly 2 participants per team; each participant can join only one team.',
      'Only Canva is permitted; designs must be original.',
      'AI tools and AI-generated content are strictly prohibited.',
      'Complete and submit within the allotted time; judges’ decision is final.',
    ],
    judging: [
      'Total: 40 marks.',
      'Round 1 – Design & Concept 10, Slogan 5, Brand Identity 5.',
      'Round 2 – Creativity & Originality 10, Content & Technical Knowledge 10.',
      'Tie-breaker: Round 2 scores.',
    ],
    year2: ['Lessly K J', 'Vismaya K'],
    year1: ['Sanjeeva G', 'Sreesha S S', 'Arjun M'],
  },
};

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <h4 className="flex items-center gap-2 text-base font-bold text-white"><FileText className="h-4 w-4 text-accent-400" /> {title}</h4>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 sm:text-base">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function CoordinatorGroup({ label, names }: { label: string; names: string[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-accent-400">{label}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {names.map((name) => <li key={name} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">{name}</li>)}
      </ul>
    </div>
  );
}

export default function EventModal({ code, onClose, onRegister }: EventModalProps) {
  useEffect(() => {
    if (!code) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [code, onClose]);

  if (!code) return null;
  const event = getEventByCode(code);
  if (!event) return null;
  const data = info[code];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink-950" role="dialog" aria-modal="true">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-br ${event.accent}`} />

      <div className="sticky top-0 z-10 border-b border-white/10 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={onClose} className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to Events</button>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-36 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
            {event.logo ? <img src={event.logo} alt="" className="h-full w-full object-contain" /> : <span className="text-xs font-bold tracking-wider text-cyan-300">PIXELPLAY</span>}
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{event.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{event.description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-xl p-4"><div className="flex items-center gap-2 text-xs text-slate-400"><Users className="h-3.5 w-3.5" /> Team Size</div><div className="mt-1.5 text-sm font-semibold text-white">Exactly {event.teamSize} participants</div></div>
          <div className="glass rounded-xl p-4"><div className="flex items-center gap-2 text-xs text-slate-400"><Calendar className="h-3.5 w-3.5" /> Event Date</div><div className="mt-1.5 text-sm font-semibold text-white">9 December 2026</div></div>
          <div className="glass rounded-xl p-4"><div className="flex items-center gap-2 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> Venue</div><div className="mt-1.5 text-sm font-semibold text-white">SRCAS Campus</div></div>
        </div>

        <div className="mt-6 space-y-5">
          <Section title="Rounds / Format" items={data.rounds} />
          <Section title="Rules & Guidelines" items={data.rules} />
          <Section title="Judging / Winning Criteria" items={data.judging} />

          <section className="glass rounded-2xl p-5 sm:p-6">
            <h4 className="flex items-center gap-2 text-base font-bold text-white"><UserCheck className="h-4 w-4 text-accent-400" /> Student Coordinators</h4>
            <div className="mt-4 space-y-5">
              <CoordinatorGroup label="II Year – Event Coordinators" names={data.year2} />
              <CoordinatorGroup label="I Year – Supporting Coordinators" names={data.year1} />
            </div>
          </section>
        </div>

        <button onClick={() => onRegister(event.code)} className="btn-primary mt-8 w-full">Register for {event.name} <ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
