import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'register' | 'admin') => void;
  currentPage: string;
}

const links = [{ label: 'Events', target: 'events' }];

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between sm:h-20">
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-3"
          aria-label="SYNALTICA 2026 home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-500/40 bg-accent-500/10 transition-all duration-300 group-hover:bg-accent-500/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3 L20 7.5 L20 16.5 L12 21 L4 16.5 L4 7.5 Z" strokeLinejoin="round" />
              <path d="M8 9.5 L12 7.5 L16 9.5 L16 14.5 L12 16.5 L8 14.5 Z" fill="currentColor" opacity="0.6" stroke="none" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg">SYNALTICA</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-400">2026</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => scrollTo(l.target)}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => onNavigate('admin')}
            className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
          >
            Admin
          </button>
          <button onClick={() => onNavigate('register')} className="btn-primary">
            Register Now
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <div className="container-px flex flex-col gap-1 py-4">
            {links.map((l) => (
              <button
                key={l.target}
                onClick={() => scrollTo(l.target)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onNavigate('admin');
              }}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition-colors hover:bg-white/5"
            >
              Admin
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onNavigate('register');
              }}
              className="btn-primary mt-2 w-full"
            >
              Register Now
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
