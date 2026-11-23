import { GraduationCap, Award, Briefcase } from 'lucide-react';

const officeBearers = [
  ['Yogeshvar M', 'Chairman, III Year'],
  ['Jeya Amirtha Raj S', 'Secretary, II Year'],
  ['Kishore T', 'Joint Secretary, I Year'],
];

const studentGroups = [
  {
    title: 'II YEAR – EVENT COORDINATORS',
    rows: [
      ['IDEATHON', 'Ilakiya P, Rishab P'],
      ['TECHNOVA', 'Anaga R, Jeevika R'],
      ['PROMPT BATTLE', 'Bavatharani M, Singarasu S'],
      ['PIXELPLAY', 'Lessly K J, Vismaya K'],
      ['DATA HUNT', 'Nitesh Kumar, Nikita Basnet'],
    ],
  },
  {
    title: 'I YEAR – SUPPORTING COORDINATORS',
    rows: [
      ['IDEATHON', 'Raja Sree P, Umapathi I, Monika R'],
      ['TECHNOVA', 'Kanishka S, Barath Priyan S, Sabrish S'],
      ['PROMPT BATTLE', 'Yasotha K, Karna S, Kreesha S S'],
      ['PIXELPLAY', 'Sanjeeva G, Sreesha S S, Arjun M'],
      ['DATA HUNT', 'Mithra S S, Thomas Edwin M, Sangeetha J'],
    ],
  },
];

const staff = [
  ['IDEATHON', 'Mrs. K. Rathi'],
  ['TECHNOVA', 'Dr. R. Anushya'],
  ['PROMPT BATTLE', 'Dr. A. Senthil Kumar'],
  ['PIXELPLAY', 'Ms. M. Aswathi'],
  ['DATA HUNT', 'Dr. M. Praneesh'],
];

function PersonCard({ name, role }: { name: string; role: string }) {
  return <div className="glass rounded-xl p-4"><p className="font-semibold text-white">{name}</p><p className="mt-1 text-xs text-slate-400">{role}</p></div>;
}

export default function OrganisingTeam() {
  return (
    <section id="organising-team" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The Organising Committee</p>
          <h2 className="mt-4 section-title">Meet the Team</h2>
          <p className="mt-4 text-slate-400">The student leaders, coordinators and faculty guiding SYNALTICA 2026.</p>
        </div>

        <div className="mt-12">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white"><Award className="h-5 w-5 text-accent-400" /> STUDENT OFFICE BEARERS – 2026</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {officeBearers.map(([name, role]) => <PersonCard key={name} name={name} role={role} />)}
          </div>
        </div>

        {studentGroups.map((group) => (
          <div className="mt-12" key={group.title}>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white"><GraduationCap className="h-5 w-5 text-accent-400" /> {group.title}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {group.rows.map(([event, names]) => <div className="glass rounded-xl p-4" key={event}>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-400">{event}</p>
                <p className="mt-2 text-sm leading-relaxed text-white">{names}</p>
              </div>)}
            </div>
          </div>
        ))}

        <div className="mt-12">
          <h3 className="mb-5 text-lg font-bold text-white">CONVENOR</h3>
          <PersonCard name="Dr. B. Vidhya" role="Head of the Department, Department of CSDA" />
        </div>

        <div className="mt-12">
          <h3 className="mb-5 text-lg font-bold text-white">STAFF ADVISOR</h3>
          <PersonCard name="Dr. M. Praneesh" role="Staff Advisor, SYNALTICA 2026" />
        </div>

        <div className="mt-12">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white"><Briefcase className="h-5 w-5 text-accent-400" /> SYNALTICA 2026 – STAFF COORDINATORS</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map(([event, name]) => <div className="glass rounded-xl p-4" key={event}>
              <p className="text-xs font-bold uppercase tracking-wider text-accent-400">{event}</p>
              <p className="mt-2 font-semibold text-white">{name}</p>
            </div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
