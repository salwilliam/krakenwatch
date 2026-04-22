import { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlphaBriefs from './pages/AlphaBriefs';
import InkL2 from './pages/InkL2';
import Payward from './pages/Payward';
import About from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderTab = () => {
    switch (activeTab) {
      case 'home':      return <Home onNav={setActiveTab} />;
      case 'ink':       return <InkL2 />;
      case 'corporate': return <Payward />;
      case 'alpha':     return <AlphaBriefs />;
      case 'about':     return <About />;
      default:          return <Home onNav={setActiveTab} />;
    }
  };

  return (
    <HelmetProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
        <Nav activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTab()}
        <Footer activeTab={activeTab} />
      </div>
    </HelmetProvider>
  );
}
