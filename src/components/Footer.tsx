import { ArrowUpRight, Heart } from 'lucide-react';

interface FooterProps {
  onRegister: () => void;
}

export default function Footer({ onRegister }: FooterProps) {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <div className="container-px py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/assets/logos/csda-department-logo.jpeg" alt="CSDA Department" className="h-10 w-10 rounded-lg object-contain bg-white p-0.5" />
              <div className="leading-none">
                <div className="font-display text-base font-bold text-white">SYNALTICA 2026</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent-400">SRCAS · CSDA</div>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
              Inter-Collegiate Technical Symposium organised by the Department of Computer Science
              with Data Analytics, Sri Ramakrishna College of Arts and Science.
            </p>
            <button onClick={onRegister} className="btn-primary mt-7">
              Register Now
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><a href="#events" className="transition-colors hover:text-white">Flagship Events</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Symposium</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>9 December 2026</li>
              <li>Venue: SRCAS Campus</li>
              <li>Sri Ramakrishna College of Arts &amp; Science</li>
              <li>Department of Computer Science with Data Analytics</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>&copy; 2026 SYNALTICA · Department of CSDA, SRCAS. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="h-3.5 w-3.5 text-accent-400" /> for the student community
          </p>
        </div>
        <p className="mt-6 text-center text-[11px] text-slate-600">Contact: <a href="mailto:jeyaamirtharaj.s@gmail.com" className="hover:text-slate-400">jeyaamirtharaj.s@gmail.com</a></p>
      </div>
    </footer>
  );
}
