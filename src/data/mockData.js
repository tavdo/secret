export const VIP_PROFILES = [
  {
    id: 1,
    name: "Alexandra",
    age: 24,
    location: "London, Mayfair",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800",
    ],
    premium_images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    ],
    rating: 4.9,
    reviews_count: 124,
    is_online: true,
    is_vip: true,
    price: "£1,200 / hr",
    tags: ["Elite", "Goddess", "Cinematic"],
    about: "An exquisite blend of elegance and passion. Alexandra offers a truly premium experience for the discerning gentleman.",
    viewers_count: 15,
    spots_left: 2,
  },
  {
    id: 2,
    name: "Elena",
    age: 22,
    location: "New York, Manhattan",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    ],
    premium_images: [],
    rating: 4.8,
    reviews_count: 89,
    is_online: true,
    is_vip: true,
    price: "$1,500 / hr",
    tags: ["Fashion Model", "Sophisticated"],
    about: "Experience true luxury with Elena, a world-class model with a taste for the finer things in life.",
    viewers_count: 8,
    spots_left: 3,
  },
  {
    id: 3,
    name: "Isabella",
    age: 25,
    location: "Paris, Le Marais",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    ],
    premium_images: [],
    rating: 5.0,
    reviews_count: 210,
    is_online: false,
    is_vip: true,
    price: "€2,000 / hr",
    tags: ["Royalty", "Exclusive"],
    about: "Isabella brings the essence of French elegance and mystery to every encounter.",
    viewers_count: 24,
    spots_left: 1,
  },
  {
    id: 4,
    name: "Sofia",
    age: 23,
    location: "Dubai, Marina",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    ],
    premium_images: [],
    rating: 4.7,
    reviews_count: 56,
    is_online: true,
    is_vip: false,
    price: "$800 / hr",
    tags: ["Exotic", "Dynamic"],
    about: "A vibrant soul with an eye for adventure. Sofia is the perfect companion for a night in the city.",
    viewers_count: 12,
    spots_left: 5,
  }
];

export const REVIEWS = [
  { id: 1, user: "James", rating: 5, comment: "Absolutely stunning and professional. Highly recommend.", date: "2 days ago" },
  { id: 2, user: "William", rating: 5, comment: "The most elegant experience I've had in years.", date: "1 week ago" },
];

export const MOCK_CHATS = [
  {
    id: 1,
    name: "Alexandra",
    lastMessage: "Looking forward to our meeting tomorrow.",
    time: "10:30 AM",
    unread: 2,
    isOnline: true,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 2,
    name: "Elena",
    lastMessage: "Are you still available?",
    time: "Yesterday",
    unread: 0,
    isOnline: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  }
];
