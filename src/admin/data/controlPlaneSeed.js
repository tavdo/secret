/** Fixtures for marketplace control plane — replace via adminApi helpers when backend ships. */

const img = (seed, w = 400, h = 520) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export function seedProfiles() {
  return [
    {
      id: 'prof-elara',
      displayName: 'Elara Laurent',
      handle: '@elara_l',
      age: 27,
      city: 'Miami',
      bio: '<p>Elevated concierge with <strong>private dining</strong> and cultural routing. Fluent EN/FR.</p>',
      hourlyRate: 850,
      vip: true,
      available: true,
      hidden: false,
      featured: true,
      avatar: img('elara-portrait'),
      gallery: [img('elara-a'), img('elara-b'), img('elara-c')],
      createdAt: '2026-02-04',
      updatedAt: '2026-05-09',
    },
    {
      id: 'prof-sienna',
      displayName: 'Sienna Rowe',
      handle: '@sienna_r',
      age: 29,
      city: 'Dubai',
      bio: '<p>Ultra‑discrete luxury travel partner. Specialty: yachts & summit weeks.</p>',
      hourlyRate: 1200,
      vip: true,
      available: true,
      hidden: false,
      featured: true,
      avatar: img('sienna-portrait'),
      gallery: [img('sienna1'), img('sienna2')],
      createdAt: '2026-01-18',
      updatedAt: '2026-05-08',
    },
    {
      id: 'prof-noir',
      displayName: 'Noir Ashton',
      handle: '@noir_ashton',
      age: 26,
      city: 'Paris',
      bio: '<p>Parisian muse & art week escort programming. Editorial styling.</p>',
      hourlyRate: 720,
      vip: false,
      available: false,
      hidden: false,
      featured: false,
      avatar: img('noir-portrait'),
      gallery: [img('noir-x'), img('noir-y')],
      createdAt: '2025-11-30',
      updatedAt: '2026-05-01',
    },
    {
      id: 'prof-velvet',
      displayName: 'Velvet Orion',
      handle: '@velvet_orion',
      age: 25,
      city: 'Los Angeles',
      bio: '<p>Red‑carpet adjacency & premium nightlife routing across SoCal.</p>',
      hourlyRate: 690,
      vip: false,
      available: true,
      hidden: true,
      featured: false,
      avatar: img('velvet-portrait'),
      gallery: [img('vlv1'), img('vlv2'), img('vlv3')],
      createdAt: '2026-03-12',
      updatedAt: '2026-04-29',
    },
    {
      id: 'prof-aurora',
      displayName: 'Aurora Lane',
      handle: '@aurora_lane',
      age: 28,
      city: 'London',
      bio: '<p>Heritage properties, club memberships, theatrical drops.</p>',
      hourlyRate: 980,
      vip: true,
      available: true,
      hidden: false,
      featured: false,
      avatar: img('aurora-portrait'),
      gallery: [img('aur1'), img('aur2')],
      createdAt: '2025-09-09',
      updatedAt: '2026-05-10',
    },
    {
      id: 'prof-kaia',
      displayName: 'Kaia Monet',
      handle: '@kaia_monet',
      age: 30,
      city: 'Monaco',
      bio: '<p>Grand prix weekends, berth coordination, après‑suite hosting.</p>',
      hourlyRate: 1350,
      vip: true,
      available: true,
      hidden: false,
      featured: true,
      avatar: img('kaia-portrait'),
      gallery: [img('kaia-a'), img('kaia-b')],
      createdAt: '2025-07-02',
      updatedAt: '2026-05-07',
    },
  ].map((p, i) => ({
    ...p,
    sortOrder: i,
  }));
}

export function seedPricingPackages() {
  return [
    {
      id: 'pkg-discovery',
      name: 'Discovery',
      description: '2h curated introduction • lounge or hotel lobby',
      hours: 2,
      basePrice: 1200,
      vipDiscountPct: 8,
      specialOfferPct: null,
      active: true,
    },
    {
      id: 'pkg-evening',
      name: 'Evening Signature',
      description: 'Dinner runway + chauffeur glide',
      hours: 5,
      basePrice: 4200,
      vipDiscountPct: 12,
      specialOfferPct: 5,
      active: true,
    },
    {
      id: 'pkg-weekender',
      name: 'Weekender',
      description: 'Weekend constellation — concierge line 24/7',
      hours: 48,
      basePrice: 28000,
      vipDiscountPct: 15,
      specialOfferPct: null,
      active: true,
    },
    {
      id: 'pkg-founder',
      name: 'Founders Vault',
      description: 'Invite‑only blackout dates & private aviation slots',
      hours: 12,
      basePrice: 18500,
      vipDiscountPct: 20,
      specialOfferPct: null,
      active: true,
    },
  ];
}

export function seedVipTiers() {
  return [
    { id: 'tier-founders', name: 'Founders', monthlyPrice: 499, perks: ['Priority bookings', 'Private beta drops'], spotlight: true, sortOrder: 0 },
    { id: 'tier-platinum', name: 'Platinum', monthlyPrice: 349, perks: ['Fee‑waived reschedule', '+2 gallery slots'], spotlight: false, sortOrder: 1 },
    { id: 'tier-elite', name: 'Elite', monthlyPrice: 199, perks: ['VIP badge', 'Queue jump'], spotlight: false, sortOrder: 2 },
  ];
}

export function seedMediaAssets() {
  const list = [];
  seedProfiles().forEach((p) => {
    [p.avatar, ...p.gallery].forEach((url, idx) => {
      if (!url) return;
      list.push({
        id: `media-${p.id}-${idx}`,
        profileId: p.id,
        url,
        label: `${p.displayName} ${idx === 0 ? 'avatar' : `slide ${idx}`}`,
        uploadedAt: p.updatedAt,
        type: 'image',
      });
    });
  });
  return list;
}
