import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlphaBriefs from './pages/AlphaBriefs';
import InkL2 from './pages/InkL2';
import Payward from './pages/Payward';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alpha-briefs" element={<AlphaBriefs />} />
            <Route path="/ink" element={<InkL2 />} />
            <Route path="/payward" element={<Payward />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
