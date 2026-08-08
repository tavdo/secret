const PLACEHOLDER =
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800';

export function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatRate(min, max, currency = 'GEL') {
  const amount = min ?? max;
  if (amount == null) return 'შეთანხმებით';
  const symbol = currency === 'USD' || currency === '$' ? '$' : '₾';
  return `${symbol}${amount}/სთ`;
}

function servicesToTags(servicesText) {
  if (!servicesText) return [];
  return String(servicesText)
    .split(/[\n,•·|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

/** Map API discovery / public profile → UI card shape. */
export function mapProfile(raw) {
  if (!raw) return null;

  const galleryFromPublic = Array.isArray(raw.galleryItems)
    ? raw.galleryItems.map((g) => g?.url).filter(Boolean)
    : [];
  const galleryUrls = raw.galleryUrls || galleryFromPublic;
  const images = [raw.avatarUrl, ...galleryUrls].filter(Boolean);
  const uniqueImages = [...new Set(images)];
  if (!uniqueImages.length) uniqueImages.push(PLACEHOLDER);

  const servicesText = raw.servicesText || '';
  const tags = servicesToTags(servicesText);
  const categories = Array.isArray(raw.categories)
    ? raw.categories.map((c) => c.name || c.slug).filter(Boolean)
    : [];

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.displayName || 'თანმხლები',
    age: raw.age ?? null,
    location: raw.city === 'Batumi' ? 'ბათუმი' : (raw.city || 'ბათუმი'),
    images: uniqueImages,
    about: stripHtml(raw.bio),
    aboutHtml: raw.bio || '',
    servicesText,
    tags: tags.length ? tags : categories.length ? categories : ['თანმხლები'],
    rating: Number(raw.avgRating || 0).toFixed(1),
    reviews_count: raw.reviewCount ?? raw.counts?.reviews ?? 0,
    price: formatRate(raw.priceMin, raw.priceMax, raw.currency),
    priceMin: raw.priceMin,
    currency: raw.currency || 'GEL',
    phone: raw.phone || '',
    is_vip: Boolean(raw.vipBadge),
    is_online: raw.availability === 'AVAILABLE',
    featured: Boolean(raw.featured),
    viewers_count: 0,
    spots_left: null,
  };
}
