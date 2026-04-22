import { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Nav from './components/Nav';
import Footer from './components/Footer';
import KrakenMap from './pages/KrakenMap';
import InkMarkets from './pages/InkMarkets';
import AlphaBriefs from './pages/AlphaBriefs';
import About from './pages/About';

function getTabFromPath(path) {
  if (path === '/ink') return 'ink';
  if (path === '/kraken') return 'kraken';
  if (path === '/payward') return 'kraken';
  if (path === '/alpha-briefs') return 'alpha';
  if (path === '/about') return 'about';
  return 'kraken';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setActiveTab(getTabFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleNav = (tab) => {
    setActiveTab(tab);
    const urls = { kraken: '/', ink: '/ink', alpha: '/alpha-briefs', about: '/about' };
    const url = urls[tab] || '/';
    window.history.pushState({}, '', url);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'kraken': return <KrakenMap onNav={handleNav} />;
      case 'ink':    return <InkMarkets onNav={handleNav} />;
      case 'alpha':  return <AlphaBriefs />;
      case 'about':  return <About />;
      default:       return <KrakenMap onNav={handleNav} />;
    }
  };

  return (
    <HelmetProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
        <Nav activeTab={activeTab} onTabChange={handleNav} />
        {renderTab()}
        <Footer activeTab={activeTab} />
      </div>
    </HelmetProvider>
  );
}
