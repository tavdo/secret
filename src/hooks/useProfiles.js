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

    const timer = setTimeout(() => {
      if (cancelled) return;
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
          setError(
            err?.response?.data?.error ||
              err?.message ||
              'პროფილების ჩატვირთვა ვერ მოხერხდა'
          );
          setProfiles([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [city, sort, take, vip, featured]);

  return { profiles, loading, error };
}
