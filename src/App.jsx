import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Prediction from './pages/Prediction';
import BlogArchive from './pages/BlogArchive';
import BlogPost from './pages/BlogPost';
import InkL2 from './pages/InkL2';
import Payward from './pages/Payward';
import About from './pages/About';
import Experimental from './pages/Experimental';
import XStocks from './pages/XStocks';

function AppShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/prediction" replace />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/ink" element={<InkL2 />} />
        <Route path="/payward" element={<Payward />} />
        <Route path="/xstocks" element={<XStocks />} />
        <Route path="/blog" element={<BlogArchive />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/alpha-briefs" element={<Navigate to="/blog" replace />} />
        <Route path="/alpha-briefs/*" element={<Navigate to="/blog" replace />} />
        <Route path="/experimental" element={<Experimental />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/prediction" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </HelmetProvider>
  );
}
