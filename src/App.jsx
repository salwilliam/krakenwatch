import { HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlphaBriefs from './pages/AlphaBriefs';
import InkL2 from './pages/InkL2';
import Payward from './pages/Payward';
import About from './pages/About';
import BriefDetail from './pages/BriefDetail';

export default function App() {
  return (
    <HelmetProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ink" element={<InkL2 />} />
          <Route path="/payward" element={<Payward />} />
          <Route path="/alpha-briefs" element={<AlphaBriefs />} />
          <Route path="/alpha-briefs/:slug" element={<BriefDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
