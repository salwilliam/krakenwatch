import { useState } from 'react';
import SubscribeModal from './SubscribeModal.jsx';

export default function SubscribeInline({ apiBase = '' }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div style={{
        marginTop: '2.5rem',
        padding: '1.5rem',
        background: 'hsl(30 25% 17%)',
        border: '1px solid hsl(30 25% 28%)',
        borderRadius: '0.5rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-display, sans-serif)',
          color: 'hsl(38 50% 68%)',
          fontWeight: 600, fontSize: '1rem',
          letterSpacing: '0.03em',
          marginBottom: '0.375rem',
        }}>Never miss an update</p>
        <p style={{
          fontFamily: 'var(--font-serif, serif)',
          color: 'hsl(38 20% 52%)',
          fontSize: '0.85rem', lineHeight: '1.5',
          marginBottom: '1rem',
        }}>New posts, dashboards, and tools — sent to you when they drop.</p>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            padding: '0.55rem 1.5rem',
            background: 'hsl(38 45% 42%)',
            border: '1px solid hsl(38 40% 50%)',
            borderRadius: '0.375rem',
            color: 'hsl(38 60% 90%)',
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 600, fontSize: '0.8rem',
            letterSpacing: '0.06em', cursor: 'pointer',
          }}
        >Subscribe</button>
      </div>

      <SubscribeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        source="inline"
        apiBase={apiBase}
      />
    </>
  );
}
