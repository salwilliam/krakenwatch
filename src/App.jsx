import { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlphaBriefs from './pages/AlphaBriefs';
import InkL2 from './pages/InkL2';
import Payward from './pages/Payward';
import About from './pages/About';
import Experimental from './pages/Experimental';

const PATH_TO_TAB = {
  '/':              'home',
  '/ink':           'ink',
  '/payward':       'corporate',
  '/alpha-briefs':  'alpha',
  '/experimental':  'experimental',
  '/about':         'about',
};

const TAB_TO_PATH = {
  home:         '/',
  ink:          '/ink',
  corporate:    '/payward',
  alpha:        '/alpha-briefs',
  experimental: '/experimental',
  about:        '/about',
};

function tabFromPath() {
  return PATH_TO_TAB[window.location.pathname] ?? 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(tabFromPath);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const path = TAB_TO_PATH[tab] ?? '/';
    if (window.location.pathname !== path) {
      history.pushState({ tab }, '', path);
    }
  };

  useEffect(() => {
    const onPop = () => setActiveTab(tabFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':         return <Home onNav={handleTabChange} />;
      case 'ink':          return <InkL2 />;
      case 'corporate':    return <Payward />;
      case 'alpha':        return <AlphaBriefs />;
      case 'about':        return <About />;
      case 'experimental': return <Experimental />;
      default:             return <Home onNav={handleTabChange} />;
    }
  };

  return (
    <HelmetProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
        <Nav activeTab={activeTab} onTabChange={handleTabChange} />
        {renderTab()}
        <Footer activeTab={activeTab} />
      </div>
    </HelmetProvider>
  );
}
