export type EventCategory = 'Technical Event';

export interface SymposiumEvent {
  code: string;
  name: string;
  description: string;
  category: EventCategory;
  teamSize: number;
  logo: string;
  accent: string;
}

export const EVENTS: SymposiumEvent[] = [
  {
    code: 'DATA_HUNT',
    name: 'DATA HUNT',
    description: 'Find it first! Solve sequential clues, follow hints and reach the final destination before the other teams.',
    category: 'Technical Event',
    teamSize: 2,
    logo: '/assets/logos/image copy 2.png',
    accent: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
  {
    code: 'TECHNOVA',
    name: 'TECHNOVA',
    description: 'CONNECT – Think • Communicate • Connect. A three-round quiz and challenge event.',
    category: 'Technical Event',
    teamSize: 2,
    logo: '/assets/logos/image.png',
    accent: 'from-sky-500/20 via-blue-500/10 to-transparent',
  },
  {
    code: 'IDEATHON',
    name: 'IDEATHON',
    description: 'A three-round ideation challenge focused on developing and pitching innovative solutions.',
    category: 'Technical Event',
    teamSize: 3,
    logo: '/assets/logos/ideathon-logo.jpg',
    accent: 'from-emerald-500/20 via-green-500/10 to-transparent',
  },
  {
    code: 'PROMPT_BATTLE',
    name: 'PROMPT BATTLE',
    description: "Put your creativity and AI skills to the test! Craft clever, creative, and effective prompts to generate the best AI-powered outputs. It's not just about using AI—it's about knowing how to command it!",
    category: 'Technical Event',
    teamSize: 2,
    logo: '/assets/logos/image copy 4.png',
    accent: 'from-blue-500/20 via-cyan-500/10 to-transparent',
  },
  {
    code: 'PIXELPLAY',
    name: 'PIXELPLAY',
    description: 'A creative designing competition featuring logo creation and technical poster designing using Canva.',
    category: 'Technical Event',
    teamSize: 2,
    logo: '/assets/logos/pixelplay-logo.png',
    accent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
  },
];

export function getEventByCode(code: string): SymposiumEvent | undefined {
  return EVENTS.find((event) => event.code === code);
}

const DISPLAY_ORDER = ['IDEATHON', 'TECHNOVA', 'PROMPT_BATTLE', 'PIXELPLAY', 'DATA_HUNT'];

export const DISPLAY_EVENTS: SymposiumEvent[] = DISPLAY_ORDER
  .map((code) => EVENTS.find((event) => event.code === code))
  .filter((event): event is SymposiumEvent => Boolean(event));
