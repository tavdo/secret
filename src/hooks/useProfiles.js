import { useEffect, useState } from 'react';
import { fetchProfiles } from '../api/publicApi';
import { mapProfile } from '../utils/mapProfile';

export function useProfiles(options = {}) {
  const {
    city = 'Batumi',
    sort = 'trending',
    take = 48,
    vip = false,
    featured = false,
  } = options;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchProfiles({ city, sort, take, vip, featured })
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data?.items) ? data.items.map(mapProfile) : [];
        setProfiles(items.filter(Boolean));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.error || err?.message || 'Failed to load profiles');
        setProfiles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city, sort, take, vip, featured]);

  return { profiles, loading, error };
}
