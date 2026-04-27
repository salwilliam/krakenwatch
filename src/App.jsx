import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogArchive from './pages/BlogArchive';
import BlogPost from './pages/BlogPost';
import InkL2 from './pages/InkL2';
import Payward from './pages/Payward';
import About from './pages/About';
import Experimental from './pages/Experimental';

const TAB_TO_PATH = {
  home:         '/',
  ink:          '/ink',
  corporate:    '/payward',
  blog:         '/blog',
  experimental: '/experimental',
  about:        '/about',
};

function activeTabFromPath(pathname) {
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname === '/ink') return 'ink';
  if (pathname === '/payward') return 'corporate';
  if (pathname === '/experimental') return 'experimental';
  if (pathname === '/about') return 'about';
  return 'home';
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = activeTabFromPath(location.pathname);

  const handleTabChange = (tab) => {
    const path = TAB_TO_PATH[tab] ?? '/';
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
      <Nav activeTab={activeTab} onTabChange={handleTabChange} />
      <Routes>
        <Route path="/" element={<Home onNav={handleTabChange} />} />
        <Route path="/ink" element={<InkL2 />} />
        <Route path="/payward" element={<Payward />} />
        <Route path="/blog" element={<BlogArchive />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/alpha-briefs" element={<Navigate to="/blog" replace />} />
        <Route path="/alpha-briefs/*" element={<Navigate to="/blog" replace />} />
        <Route path="/experimental" element={<Experimental />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer activeTab={activeTab} />
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
