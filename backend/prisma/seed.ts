/**
 * Idempotent placeholder providers for the storefront.
 * Run: npm run db:seed --prefix backend
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function publicIdForUrl(url: string) {
  return `seed-${createHash("sha1").update(url).digest("hex").slice(0, 16)}`;
}

const PLACEHOLDERS = [
  {
    email: "placeholder.nino@marketplace.local",
    displayName: "Nino",
    slug: "nino-batumi",
    age: 24,
    phone: "+995555101001",
    featured: true,
    rate: 180,
    servicesText: "ვახშმი\nმოგზაურობის თანმხლები\nპირადი ღონისძიებები\nქალაქის ტურები",
    bio: "თბილი და ელეგანტური თანმხლები ბათუმში.",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    email: "placeholder.mari@marketplace.local",
    displayName: "Mari",
    slug: "mari-batumi",
    age: 26,
    phone: "+995555101002",
    featured: true,
    rate: 150,
    servicesText: "ყავის შეხვედრა\nსაღამოს გასეირნება\nსოციალური ღონისძიებები",
    bio: "მეგობრული ბათუმელი კარგი საუბრისა და ზღვისპირა საღამოებისთვის.",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c17226555e?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    email: "placeholder.ana@marketplace.local",
    displayName: "Ana",
    slug: "ana-batumi",
    age: 23,
    phone: "+995555101003",
    featured: false,
    rate: 220,
    servicesText: "ღონისძიებები\nიახტის დღე\nვახშმის თანმხლები\nფოტოსესია",
    bio: "თანმხლები პრემიუმ საღამოებისა და პირადი შეხვედრებისთვის ბათუმში.",
    images: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    email: "placeholder.lika@marketplace.local",
    displayName: "Lika",
    slug: "lika-batumi",
    age: 28,
    phone: "+995555101004",
    featured: false,
    rate: 140,
    servicesText: "დღის ტურები\nშოპინგის თანმხლები\nყავის შეხვედრა",
    bio: "სტილური თანმხლები ბათუმის ბულვარის ირგვლივ დღის გეგმებისთვის.",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80&sat=-20",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    email: "placeholder.salome@marketplace.local",
    displayName: "Salome",
    slug: "salome-batumi",
    age: 25,
    phone: "+995555101005",
    featured: true,
    rate: 200,
    servicesText: "პირადი ვახშმები\nმოგზაურობის თანმხლები\nკლუბის საღამოები\nბიზნეს ღონისძიებები",
    bio: "დისკრეტული და დახვეწილი თანმხლები ბათუმში.",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c17226555e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80",
    ],
  }
];

async function upsertPlaceholder(p: (typeof PLACEHOLDERS)[number]) {
  const passwordHash = await bcrypt.hash("Placeholder123!", 12);
  const avatar = p.images[0];

  const existing = await prisma.user.findUnique({
    where: { email: p.email },
    include: { profile: true },
  });

  const profileData = {
    displayName: p.displayName,
    slug: p.slug,
    bio: p.bio,
    city: "Batumi",
    age: p.age,
    phone: p.phone,
    avatarUrl: avatar,
    vipBadge: false,
    featured: p.featured,
    active: true,
    availability: "AVAILABLE" as const,
    priceMin: p.rate,
    priceMax: p.rate,
    currency: "GEL",
    servicesText: p.servicesText,
    lastActiveAt: new Date(),
  };

  if (existing?.profile) {
    await prisma.galleryItem.deleteMany({ where: { profileId: existing.profile.id } });
    await prisma.profile.update({
      where: { id: existing.profile.id },
      data: {
        ...profileData,
        galleryItems: {
          create: p.images.map((url, sortOrder) => ({
            url,
            publicId: publicIdForUrl(url),
            vipLocked: false,
            sortOrder,
            mimeType: "image/jpeg",
            bytes: 0,
          })),
        },
      },
    });
    return { slug: p.slug, status: "updated" as const };
  }

  await prisma.user.create({
    data: {
      email: p.email,
      passwordHash,
      role: "PROVIDER",
      emailVerified: true,
      accountStatus: "ACTIVE",
      profile: {
        create: {
          ...profileData,
          galleryItems: {
            create: p.images.map((url, sortOrder) => ({
              url,
              publicId: publicIdForUrl(`${p.slug}-${sortOrder}-${url}`),
              vipLocked: false,
              sortOrder,
              mimeType: "image/jpeg",
              bytes: 0,
            })),
          },
        },
      },
    },
  });

  return { slug: p.slug, status: "created" as const };
}

async function main() {
  for (const p of PLACEHOLDERS) {
    const result = await upsertPlaceholder(p);
    console.log(`${result.status}: ${result.slug}`);
  }
  console.log(`Done — ${PLACEHOLDERS.length} placeholder profiles ready.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
