import { Target, Users, Lightbulb, Trophy } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const pillars = [
  {
    icon: Target,
    title: 'Technical Depth',
    body: 'Events designed to test core computer science fundamentals alongside modern data and analytics skills.',
  },
  {
    icon: Users,
    title: 'Inter-Collegiate',
    body: 'A meeting ground for students from diverse institutions to compete, collaborate and exchange ideas.',
  },
  {
    icon: Lightbulb,
    title: 'Creative Thinking',
    body: 'Challenges that reward originality — from ideation pitches to on-the-spot connection rounds.',
  },
  {
    icon: Trophy,
    title: 'Recognition',
    body: 'A stage to showcase talent, earn accolades and build a portfolio of competitive achievements.',
  },
];

export default function About() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div ref={ref} className="container-px reveal">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow">About the Symposium</p>
            <h2 className="mt-4 section-title text-balance">
              Where technical minds meet their next challenge.
            </h2>
            <p className="mt-6 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
              SYNALTICA 2026 is an inter-collegiate technical symposium that brings together
              students from colleges and universities to showcase their technical knowledge,
              creativity, analytical thinking and problem-solving abilities.
            </p>
            <p className="mt-4 text-pretty text-base leading-relaxed text-slate-400">
              Hosted by the Department of Computer Science with Data Analytics (CSDA) at Sri
              Ramakrishna College of Arts and Science, the symposium is crafted as a rigorous,
              rewarding platform — bridging academic learning with the demands of a fast-moving
              technology landscape.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="glass group rounded-2xl p-6 transition-all duration-300 hover:border-accent-500/30 hover:bg-white/[0.05]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/30 bg-accent-500/10 text-accent-400 transition-transform duration-300 group-hover:scale-110">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
