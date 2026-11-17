import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import Footer from '@/components/Footer';
import EventModal from '@/components/EventModal';
import RegistrationForm from '@/components/RegistrationForm';
import RegistrationSuccess, { type SuccessRegistration } from '@/components/RegistrationSuccess';
import AdminDashboard from '@/components/AdminDashboard';

type Page = 'home' | 'register' | 'success' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [eventModal, setEventModal] = useState<string | null>(null);
  const [preselectedEvent, setPreselectedEvent] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessRegistration | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

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
    </div>
  );
}
