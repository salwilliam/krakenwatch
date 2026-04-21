import { useState, useEffect } from 'react';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function transformApiSummary(json) {
  return {
    updated_at: json.updatedAt,
    updated_display: formatDate(json.updatedAt),
    ink: {
      tvl_millions: parseFloat((json.inkTvl / 1e6).toFixed(1)),
      protocol_count: json.inkProtocols,
    },
    ipo: {
      avg_pct: parseFloat((json.krakenIpoOdds * 100).toFixed(1)),
    },
    secondary_market: {
      avg_pps: parseFloat(json.krakenSharePrice.toFixed(2)),
    },
  };
}

export function useSiteData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/metrics/summary')
      .then(res => {
        if (!res.ok) throw new Error('API error ' + res.status);
        return res.json();
      })
      .then(json => {
        setData(transformApiSummary(json));
        setLoading(false);
      })
      .catch(() => {
        fetch('/site-data.json')
          .then(r => r.json())
          .then(json => { setData(json); setLoading(false); })
          .catch(err => { setError(err); setLoading(false); });
      });
  }, []);

  return { data, loading, error };
}
