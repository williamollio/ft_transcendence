import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users
  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '@wollio',
      intraId: 0x06,
      friends: { create: [{ name: '@mhahn', intraId: 0x07 }] },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '@mhahn',
      intraId: 0x07,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: '@thomass',
      intraId: 0x0,
    },
  });

  console.log({ user1, user2, user3 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
