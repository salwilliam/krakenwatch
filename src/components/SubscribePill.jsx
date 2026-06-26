import { useState, useEffect } from 'react';
import SubscribeModal from './SubscribeModal.jsx';

const DISMISS_KEY = 'kw_subscribe_dismissed';

function isDismissed() {
  try {
    const val = localStorage.getItem(DISMISS_KEY);
    return val ? Date.now() < Number(val) : false;
  } catch (_) { return false; }
}

export default function SubscribePill({ apiBase = '' }) {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isDismissed()) return;
    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct >= 0.25) setVisible(true);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 86400000)); } catch (_) {}
  }

  function openModal() { setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  if (!visible) return null;

  return (
    <>
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        zIndex: 900,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'hsl(38 45% 38%)',
        border: '1px solid hsl(38 40% 48%)',
        borderRadius: '9999px',
        padding: '0.5rem 1.125rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        cursor: 'pointer',
      }}>
        <button
          onClick={openModal}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'hsl(38 65% 88%)',
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 600, fontSize: '0.8rem',
            letterSpacing: '0.08em', padding: 0,
          }}
        >Subscribe</button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'hsl(38 35% 65%)', fontSize: '1rem',
            lineHeight: 1, padding: '0 0 0 0.25rem',
          }}
        >×</button>
      </div>

      <SubscribeModal
        isOpen={modalOpen}
        onClose={() => { closeModal(); dismiss(); }}
        source="pill"
        apiBase={apiBase}
      />
    </>
  );
}
