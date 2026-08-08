const KEY = 'secret-favorites-v1';

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getFavoriteIds() {
  return readRaw().map((x) => x.id).filter(Boolean);
}

export function getFavorites() {
  return readRaw();
}

export function isFavorite(id) {
  if (!id) return false;
  return readRaw().some((x) => x.id === id);
}

export function toggleFavorite(profile) {
  if (!profile?.id) return false;
  const list = readRaw();
  const exists = list.some((x) => x.id === profile.id);
  const next = exists
    ? list.filter((x) => x.id !== profile.id)
    : [
        {
          id: profile.id,
          slug: profile.slug,
          name: profile.name,
          images: profile.images?.slice?.(0, 1) || [],
          location: profile.location,
          price: profile.price,
          rating: profile.rating,
          tags: profile.tags || [],
          is_vip: Boolean(profile.is_vip),
          is_online: Boolean(profile.is_online),
          age: profile.age ?? null,
          servicesText: profile.servicesText || '',
        },
        ...list,
      ];
  localStorage.setItem(KEY, JSON.stringify(next));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('favorites:changed'));
  }
  return !exists;
}
