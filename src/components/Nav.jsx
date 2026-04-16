import { Link, useLocation } from 'react-router-dom';
import './Nav.css';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/alpha-briefs', label: 'Alpha Briefs' },
  { to: '/ink', label: 'Ink L2' },
  { to: '/payward', label: 'Payward' },
];

export default function Nav() {
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-skull">☠</span>
          <span className="nav-brand-name">Kraken Watch</span>
        </Link>
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
