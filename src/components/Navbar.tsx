import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'register' | 'admin') => void;
  currentPage: string;
}

const links = [
  { label: 'Home', target: 'home' },
  { label: 'Events', target: 'events' },
  { label: 'Organising Team', target: 'organising-team' },
];

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (target: string) => {
    setOpen(false);
    if (target === 'home') {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentPage !== 'home') {
      onNavigate('home');
      window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 120);
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'border-b border-white/10 bg-ink-950/85 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <nav className="container-px flex min-h-16 items-center justify-between gap-5 py-2 sm:min-h-20">
        <button onClick={() => navigate('home')} className="group flex min-w-0 items-center gap-3 text-left" aria-label="SYNALTICA 2026 home">
          <img src="/assets/logos/csda-department-logo.jpeg" alt="Department of Computer Science with Data Analytics" className="h-11 w-11 flex-shrink-0 rounded-xl object-contain bg-white p-0.5" />
          <span className="min-w-0 max-w-[210px] text-left text-[10px] font-semibold leading-snug text-white sm:max-w-[320px] sm:text-xs">
            Department of Computer Science with Data Analytics
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <button key={link.target} onClick={() => navigate(link.target)} className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex">
          <button onClick={() => onNavigate('register')} className="btn-primary">
            Register Now <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <button onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <div className="container-px flex flex-col gap-1 py-4">
            {links.map((link) => (
              <button key={link.target} onClick={() => navigate(link.target)} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-white/5">
                {link.label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); onNavigate('register'); }} className="btn-primary mt-2 w-full">
              Register Now <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
