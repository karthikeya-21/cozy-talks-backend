import * as bcrypt from "bcrypt";
import { ChatRequestStatus, MessageType, PrismaClient, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const seedPassword = "cozy12345";
  const passwordHash = await bcrypt.hash(seedPassword, 10);

  const demoUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "karthik@cozytalks.dev" },
      update: {
        name: "Karthik",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.OFFLINE,
      },
      create: {
        name: "Karthik",
        email: "karthik@cozytalks.dev",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.OFFLINE,
      },
    }),
    prisma.user.upsert({
      where: { email: "akhila@cozytalks.dev" },
      update: {
        name: "Akhila",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.ONLINE,
      },
      create: {
        name: "Akhila",
        email: "akhila@cozytalks.dev",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.ONLINE,
      },
    }),
    prisma.user.upsert({
      where: { email: "rahul@cozytalks.dev" },
      update: {
        name: "Rahul",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.OFFLINE,
      },
      create: {
        name: "Rahul",
        email: "rahul@cozytalks.dev",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.OFFLINE,
      },
    }),
    prisma.user.upsert({
      where: { email: "sanjana@cozytalks.dev" },
      update: {
        name: "Sanjana",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.ONLINE,
      },
      create: {
        name: "Sanjana",
        email: "sanjana@cozytalks.dev",
        passwordHash,
        avatarUrl: null,
        status: UserStatus.ONLINE,
      },
    }),
  ]);

  const [karthik, akhila, rahul, sanjana] = demoUsers;
  const userIds = demoUsers.map((user) => user.id);

  await prisma.message.deleteMany({
    where: {
      fromUserId: { in: userIds },
      toUserId: { in: userIds },
    },
  });

  await prisma.chatRequest.deleteMany({
    where: {
      OR: [
        { fromUserId: { in: userIds } },
        { toUserId: { in: userIds } },
      ],
    },
  });

  await prisma.chatRequest.createMany({
    data: [
      {
        fromUserId: karthik.id,
        toUserId: akhila.id,
        status: ChatRequestStatus.APPROVED,
      },
      {
        fromUserId: rahul.id,
        toUserId: karthik.id,
        status: ChatRequestStatus.APPROVED,
      },
      {
        fromUserId: sanjana.id,
        toUserId: karthik.id,
        status: ChatRequestStatus.PENDING,
      },
    ],
  });

  const now = Date.now();

  await prisma.message.createMany({
    data: [
      {
        fromUserId: akhila.id,
        toUserId: karthik.id,
        content: "The new Next.js UI feels much smoother already.",
        type: MessageType.TEXT,
        createdAt: new Date(now - 1000 * 60 * 30),
      },
      {
        fromUserId: karthik.id,
        toUserId: akhila.id,
        content: "Nice. I just added better mobile navigation and unread badges too.",
        type: MessageType.TEXT,
        createdAt: new Date(now - 1000 * 60 * 27),
      },
      {
        fromUserId: rahul.id,
        toUserId: karthik.id,
        content: "Once the backend is seeded, the demo flow will be much easier to show.",
        type: MessageType.TEXT,
        createdAt: new Date(now - 1000 * 60 * 21),
      },
      {
        fromUserId: karthik.id,
        toUserId: rahul.id,
        content: "Exactly. I also refreshed the README so setup is clearer.",
        type: MessageType.TEXT,
        createdAt: new Date(now - 1000 * 60 * 18),
      },
    ],
  });

  console.log("Seed completed.");
  console.log(`Demo password for seeded users: ${seedPassword}`);
  console.log("Users:");
  console.log("- karthik@cozytalks.dev");
  console.log("- akhila@cozytalks.dev");
  console.log("- rahul@cozytalks.dev");
  console.log("- sanjana@cozytalks.dev");
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
