import { useState, useEffect, useCallback } from 'react';

const DISMISS_KEY = 'kw_subscribe_dismissed';
const DISMISS_DAYS = 7;

function setDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400000));
  } catch (_) {}
}

export default function SubscribeModal({ isOpen, onClose, source, apiBase = '' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setEmail('');
    setStatus('idle');
    setErrorMsg('');
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${apiBase}/subscribe`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setDismissed();
    } catch (_) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }, [email, source, apiBase]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{
        background: 'hsl(30 28% 15%)',
        border: '1px solid hsl(30 25% 28%)',
        borderRadius: '0.75rem',
        width: '100%', maxWidth: '400px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'hsl(38 25% 45%)', fontSize: '1.25rem', lineHeight: 1,
            padding: '0.25rem',
          }}
        >×</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
            <p style={{
              fontFamily: 'var(--font-display, sans-serif)',
              color: 'hsl(38 55% 68%)',
              fontSize: '1.1rem', fontWeight: 600,
              letterSpacing: '0.03em',
            }}>You're on the list.</p>
            <p style={{
              fontFamily: 'var(--font-serif, serif)',
              color: 'hsl(38 25% 52%)',
              fontSize: '0.875rem', marginTop: '0.5rem',
            }}>We'll be in touch when something worth reading drops.</p>
          </div>
        ) : (
          <>
            <h2 style={{
              fontFamily: 'var(--font-display, sans-serif)',
              color: 'hsl(38 55% 72%)',
              fontSize: '1.25rem', fontWeight: 700,
              letterSpacing: '0.03em',
              marginBottom: '0.5rem',
            }}>Never miss an update</h2>
            <p style={{
              fontFamily: 'var(--font-serif, serif)',
              color: 'hsl(38 20% 55%)',
              fontSize: '0.875rem', lineHeight: '1.6',
              marginBottom: '1.5rem',
            }}>Get new posts, dashboards, tools, and feature launches sent to you.</p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={status === 'loading'}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.625rem 0.875rem',
                  background: 'hsl(30 25% 10%)',
                  border: '1px solid hsl(30 25% 32%)',
                  borderRadius: '0.375rem',
                  color: 'hsl(38 35% 75%)',
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  marginBottom: '0.75rem',
                }}
              />
              {errorMsg && (
                <p style={{
                  color: 'hsl(350 55% 58%)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-sans, sans-serif)',
                  marginBottom: '0.75rem',
                }}>{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%', padding: '0.65rem',
                  background: 'hsl(38 45% 42%)',
                  border: '1px solid hsl(38 40% 50%)',
                  borderRadius: '0.375rem',
                  color: 'hsl(38 60% 90%)',
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontWeight: 600, fontSize: '0.875rem',
                  letterSpacing: '0.06em', cursor: 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'hsl(38 20% 45%)',
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '0.8rem', fontStyle: 'italic',
                  textDecoration: 'underline', textDecorationStyle: 'dotted',
                }}
              >Maybe later</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
