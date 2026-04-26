"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
                status: client_1.UserStatus.OFFLINE,
            },
            create: {
                name: "Karthik",
                email: "karthik@cozytalks.dev",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.OFFLINE,
            },
        }),
        prisma.user.upsert({
            where: { email: "akhila@cozytalks.dev" },
            update: {
                name: "Akhila",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.ONLINE,
            },
            create: {
                name: "Akhila",
                email: "akhila@cozytalks.dev",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.ONLINE,
            },
        }),
        prisma.user.upsert({
            where: { email: "rahul@cozytalks.dev" },
            update: {
                name: "Rahul",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.OFFLINE,
            },
            create: {
                name: "Rahul",
                email: "rahul@cozytalks.dev",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.OFFLINE,
            },
        }),
        prisma.user.upsert({
            where: { email: "sanjana@cozytalks.dev" },
            update: {
                name: "Sanjana",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.ONLINE,
            },
            create: {
                name: "Sanjana",
                email: "sanjana@cozytalks.dev",
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.ONLINE,
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
                status: client_1.ChatRequestStatus.APPROVED,
            },
            {
                fromUserId: rahul.id,
                toUserId: karthik.id,
                status: client_1.ChatRequestStatus.APPROVED,
            },
            {
                fromUserId: sanjana.id,
                toUserId: karthik.id,
                status: client_1.ChatRequestStatus.PENDING,
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
                type: client_1.MessageType.TEXT,
                createdAt: new Date(now - 1000 * 60 * 30),
            },
            {
                fromUserId: karthik.id,
                toUserId: akhila.id,
                content: "Nice. I just added better mobile navigation and unread badges too.",
                type: client_1.MessageType.TEXT,
                createdAt: new Date(now - 1000 * 60 * 27),
            },
            {
                fromUserId: rahul.id,
                toUserId: karthik.id,
                content: "Once the backend is seeded, the demo flow will be much easier to show.",
                type: client_1.MessageType.TEXT,
                createdAt: new Date(now - 1000 * 60 * 21),
            },
            {
                fromUserId: karthik.id,
                toUserId: rahul.id,
                content: "Exactly. I also refreshed the README so setup is clearer.",
                type: client_1.MessageType.TEXT,
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
//# sourceMappingURL=seed.js.map