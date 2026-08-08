import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = "admin@esc.com";
const password = "admin123";
const hash = await bcrypt.hash(password, 12);

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  await prisma.user.update({
    where: { email },
    data: {
      passwordHash: hash,
      role: "ADMIN",
      emailVerified: true,
      accountStatus: "ACTIVE",
      failedLoginAttempts: 0,
      lockoutUntil: null,
    },
  });
  console.log("UPDATED", email, existing.id);
} else {
  const old = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (old) {
    await prisma.user.update({
      where: { id: old.id },
      data: {
        email,
        passwordHash: hash,
        role: "ADMIN",
        emailVerified: true,
        accountStatus: "ACTIVE",
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });
    console.log("REWIRED", old.id, "->", email);
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        role: "ADMIN",
        emailVerified: true,
        accountStatus: "ACTIVE",
        profile: {
          create: {
            displayName: "Admin",
            slug: "admin-esc",
            bio: "Platform administrator",
            city: "HQ",
            active: false,
            availability: "OFFLINE",
          },
        },
      },
    });
    console.log("CREATED", email, user.id);
  }
}

await prisma.$disconnect();
