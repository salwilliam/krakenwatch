import { useState, useEffect } from 'react';

export function useSiteData() {
  const initial = (typeof window !== 'undefined' && window.__SITE_DATA__) || null;
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initial) return; // data already injected by the worker — no fetch needed
    fetch('/site-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
