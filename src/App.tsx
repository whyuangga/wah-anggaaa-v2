import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import Intro from './components/Intro';
import { TransitionProvider } from './lib/transition';
import { Analytics } from '@vercel/analytics/react';

gsap.registerPlugin(ScrollTrigger);

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));
const WorkCase = lazy(() => import('./routes/WorkCase'));
const NotFound = lazy(() => import('./routes/NotFound'));
const Journal = lazy(() => import('./routes/Journal'));
const JournalPost = lazy(() => import('./routes/JournalPost'));

/** Scroll ke atas + refresh trigger setiap ganti route. */
function RouteSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}

function Shell() {
  // Konten tidak di-mount sebelum intro selesai (pola Onoera, versi kalem).
  const [entered, setEntered] = useState(false);

  // preload chunk route sejak awal → navigasi tanpa jeda
  useEffect(() => {
    import('./routes/Home').catch(() => {});
    import('./routes/About').catch(() => {});
    import('./routes/Contact').catch(() => {});
    import('./routes/WorkCase').catch(() => {});
    import('./routes/NotFound').catch(() => {});
    import('./routes/Journal').catch(() => {});
    import('./routes/JournalPost').catch(() => {});
  }, []);

  return (
    <TransitionProvider>
      <div className="min-h-screen bg-paper text-ink">
        {!entered && <Intro onFinish={() => setEntered(true)} />}
        {entered && <Header />}
        <RouteSync />
        {entered && (
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/works/:slug" element={<WorkCase />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<JournalPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        )}
      </div>
      <Analytics />
    </TransitionProvider>
  );
}

export default function App() {
  return (
    // BASE_URL: '/' di Vercel, '/wah-anggaaa/' di dev lokal & Pages —
    // basename router selalu mengikutinya.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  );
}
