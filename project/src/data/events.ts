export type EventCategory = 'Data' | 'Quiz' | 'Ideation' | 'Logic' | 'Analytics';

export interface SymposiumEvent {
  code: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  teamSize: { min: number; max: number };
  icon: string;
  accent: string;
}

export const EVENTS: SymposiumEvent[] = [
  {
    code: 'DATA_HUNT',
    name: 'DATA HUNT',
    tagline: 'Mine the data, uncover the story.',
    description:
      'A high-intensity data exploration challenge where participants comb through large datasets to extract meaningful insights, identify patterns and present findings under time pressure.',
    category: 'Data',
    teamSize: { min: 1, max: 3 },
    icon: 'Database',
    accent: 'from-emerald-400/20 to-teal-500/10',
  },
  {
    code: 'TECH_QUIZ',
    name: 'TECH QUIZ',
    tagline: 'Where knowledge meets the buzzer.',
    description:
      'A multi-round technical quiz spanning computer science fundamentals, emerging technologies, data analytics and current industry trends. Speed, accuracy and depth all count.',
    category: 'Quiz',
    teamSize: { min: 1, max: 2 },
    icon: 'BrainCircuit',
    accent: 'from-sky-400/20 to-indigo-500/10',
  },
  {
    code: 'IDEOTHON',
    name: 'IDEOTHON',
    tagline: 'Pitch the future, one idea at a time.',
    description:
      'An ideation contest where teams propose innovative, technology-driven solutions to a real-world problem statement. Judged on creativity, feasibility, impact and clarity of pitch.',
    category: 'Ideation',
    teamSize: { min: 2, max: 4 },
    icon: 'Lightbulb',
    accent: 'from-amber-400/20 to-orange-500/10',
  },
  {
    code: 'CONNECTION',
    name: 'CONNECTION',
    tagline: 'Connect the dots before time runs out.',
    description:
      'A fast-paced technical connection round where participants link clues, concepts and visuals to arrive at the right answer. Tests breadth of technical awareness and quick thinking.',
    category: 'Logic',
    teamSize: { min: 1, max: 2 },
    icon: 'Network',
    accent: 'from-fuchsia-400/20 to-pink-500/10',
  },
  {
    code: 'DASHBOARD',
    name: 'DASHBOARD',
    tagline: 'Turn raw data into decision-ready art.',
    description:
      'A data visualisation challenge where participants build an impactful, interactive dashboard from a provided dataset within a fixed time. Judged on design, clarity and analytical depth.',
    category: 'Analytics',
    teamSize: { min: 1, max: 3 },
    icon: 'BarChart3',
    accent: 'from-cyan-400/20 to-blue-500/10',
  },
];

export function getEventByCode(code: string): SymposiumEvent | undefined {
  return EVENTS.find((e) => e.code === code);
}

export const TEAM_EVENTS = new Set(['IDEOTHON', 'DASHBOARD']);
