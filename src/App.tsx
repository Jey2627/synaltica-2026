import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import OrganisingTeam from '@/components/OrganisingTeam';
import Footer from '@/components/Footer';
import EventModal from '@/components/EventModal';
import RegistrationForm from '@/components/RegistrationForm';
import RegistrationSuccess, { type SuccessRegistration } from '@/components/RegistrationSuccess';
import AdminDashboard from '@/components/AdminDashboard';
import MascotLayer from '@/components/Mascot';

type Page = 'home' | 'register' | 'success' | 'admin';

const isAdminPath = () => window.location.pathname.replace(/\/+$/, '').toLowerCase() === '/admin';

export default function App() {
  const [page, setPageState] = useState<Page>(() => (isAdminPath() ? 'admin' : 'home'));
  const [eventModal, setEventModal] = useState<string | null>(null);
  const [preselectedEvent, setPreselectedEvent] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessRegistration | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

  // Keep the URL in sync so /admin works with direct links, refresh and the back button.
  const setPage = (next: Page) => {
    if (next === 'admin' && !isAdminPath()) window.history.pushState(null, '', '/admin');
    else if (next !== 'admin' && isAdminPath()) window.history.pushState(null, '', '/');
    setPageState(next);
  };

  useEffect(() => {
    const onPopState = () => setPageState((current) => (isAdminPath() ? 'admin' : current === 'admin' ? 'home' : current));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const goRegister = (code?: string) => {
    setPreselectedEvent(code ?? null);
    setPage('register');
  };

  const goHome = () => setPage('home');

  const showNavbar = page !== 'success';

  return (
    <div className="relative min-h-screen">
      {showNavbar && <Navbar onNavigate={(p) => setPage(p)} currentPage={page} />}

      {page === 'home' && (
        <main>
          <Hero
            onRegister={() => goRegister()}
            onExplore={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <Events
            onViewDetails={(code) => setEventModal(code)}
            onRegister={(code) => goRegister(code)}
          />
          <OrganisingTeam />
          <Footer onRegister={() => goRegister()} />
          <EventModal
            code={eventModal}
            onClose={() => setEventModal(null)}
            onRegister={(code) => {
              setEventModal(null);
              goRegister(code);
            }}
          />
        </main>
      )}

      {page === 'register' && (
        <main>
          <RegistrationForm
            preselectedEvent={preselectedEvent}
            onBack={goHome}
            onSuccess={(reg) => {
              setSuccessData(reg);
              setPage('success');
            }}
          />
        </main>
      )}

      {page === 'success' && successData && (
        <main>
          <RegistrationSuccess
            registration={successData}
            onHome={goHome}
            onRegisterAnother={() => {
              setSuccessData(null);
              setPreselectedEvent(null);
              setPage('register');
            }}
          />
        </main>
      )}

      {page === 'admin' && (
        <main>
          <AdminDashboard onBackHome={goHome} />
        </main>
      )}

      <MascotLayer page={page} />
    </div>
  );
}
