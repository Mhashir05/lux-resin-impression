import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@luxresin.com";
  const plainPassword = "admin123";

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
  console.log("You can now log in with this email and the password you set.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });