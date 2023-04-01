import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const user1 = await prisma.user.upsert({
    where: { id: 'user1' },
    update: {},
    create: {
      id: 'user1',
      intraId: 'user1',
      name: 'william',
      eloScore: 1200,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 'user2' },
    update: {},
    create: {
      id: 'user2',
      intraId: 'user2',
      name: 'manuel',
      eloScore: 1100,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: 'user3' },
    update: {},
    create: {
      id: 'user3',
      intraId: 'user3',
      name: 'tomas',
      eloScore: 500,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { id: 'user4' },
    update: {},
    create: {
      id: 'user4',
      intraId: 'user4',
      name: 'mouad',
      eloScore: 1150,
    },
  });

  const channelPublic = await prisma.channel.upsert({
    where: { id: 'channel1' },
    update: {},
    create: {
      id: 'channel1',
      name: 'Someshit',
      users: {
        create: [
          { userId: 'user1', role: 'OWNER' },
          { userId: 'user2', role: 'ADMIN' },
          { userId: 'user3' },
        ],
      },
    },
  });

  const channelPrivate = await prisma.channel.upsert({
    where: { id: 'channel2' },
    update: {},
    create: {
      id: 'channel2',
      name: 'Hidden chaaaaaat group',
      type: 'PRIVATE',
      users: {
        create: [
          { userId: 'user2', role: 'OWNER' },
          { userId: 'user4', role: 'USER' },
        ],
      },
      invites: {
        connect: [{ id: 'user1' }, { id: 'user2' }],
      },
    },
  });

  const channelProtected = await prisma.channel.upsert({
    where: { id: 'channel3' },
    update: {},
    create: {
      id: 'channel3',
      name: 'you can t say shit here',
      type: 'PROTECTED',
      passwordHash:
        '$argon2id$v=19$m=65536,t=3,p=4$u7C7YawZ2zrB8EMSxbnneg$R2p8E8EKJu7mr5TNRK8gmSipfZzfh2LvnM61CiCRdqY',
      users: {
        create: [
          { userId: 'user1', role: 'ADMIN' },
          { userId: 'user2', role: 'OWNER' },
          { userId: 'user4', role: 'USER' },
        ],
      },
    },
  });

  const directMessage1 = await prisma.channel.upsert({
    where: { id: 'channel4' },
    update: {},
    create: {
      id: 'channel4',
      name: 'william',
      type: 'DIRECTMESSAGE',
      users: {
        create: [{ userId: 'user1' }, { userId: 'user2' }],
      },
    },
  });

  const directMessage2 = await prisma.channel.upsert({
    where: { id: 'channel5' },
    update: {},
    create: {
      id: 'channel5',
      name: 'mouad',
      type: 'DIRECTMESSAGE',
      users: {
        create: [{ userId: 'user1' }, { userId: 'user3' }],
      },
    },
  });

  const match1 = await prisma.match.upsert({
    where: { gameId: 'match1' },
    update: {},
    create: {
      gameId: 'match1',
      playerOneId: 'user1',
      playerTwoId: 'user2',
      p1s: 10,
      p2s: 9,
    },
  });

  const match2 = await prisma.match.upsert({
    where: { gameId: 'match2' },
    update: {},
    create: {
      gameId: 'match2',
      playerOneId: 'user2',
      playerTwoId: 'user3',
      p1s: 8,
      p2s: 10,
    },
  });

  const match3 = await prisma.match.upsert({
    where: { gameId: 'match3' },
    update: {},
    create: {
      gameId: 'match3',
      playerOneId: 'user3',
      playerTwoId: 'user4',
      p1s: 10,
      p2s: 5,
    },
  });

  const match4 = await prisma.match.upsert({
    where: { gameId: 'match4' },
    update: {},
    create: {
      gameId: 'match4',
      playerOneId: 'user4',
      playerTwoId: 'user1',
      p1s: 10,
      p2s: 3,
    },
  });

  const match5 = await prisma.match.upsert({
    where: { gameId: 'match5' },
    update: {},
    create: {
      gameId: 'match5',
      playerOneId: 'user1',
      playerTwoId: 'user4',
      p1s: 2,
      p2s: 10,
    },
  });

  console.log({
    user1,
    user2,
    user3,
    user4,
    channelPublic,
    channelPrivate,
    channelProtected,
    directMessage1,
    directMessage2,
    match1,
    match2,
    match3,
    match4,
    match5,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
