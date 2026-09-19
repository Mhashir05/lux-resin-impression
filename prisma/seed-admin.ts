import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in the environment (e.g. in .env) before running the admin seed."
    );
  }

  // Hash the password before storing
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Remove any existing admin with same email, then create fresh
  await prisma.adminUser.deleteMany({ where: { email } });

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
    },
  });

  console.log(`Admin created: ${admin.email}`);
  console.log("You can now log in with SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });