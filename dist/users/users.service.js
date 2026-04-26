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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const cozy_bot_constants_1 = require("./cozy-bot.constants");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async onModuleInit() {
        try {
            await this.ensureCozyBotUser();
            this.logger.log("Cozy Bot user ensured during startup.");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown Cozy Bot startup error.";
            this.logger.error(`Failed to ensure Cozy Bot user during startup: ${message}`);
        }
    }
    async discoverUsers(currentUserId, query) {
        await this.ensureCozyBotConnection(currentUserId);
        const [users, relatedRequests] = await Promise.all([
            this.prisma.user.findMany({
                where: {
                    id: { not: currentUserId },
                    ...(query
                        ? {
                            name: {
                                contains: query,
                                mode: "insensitive",
                            },
                        }
                        : {}),
                },
                orderBy: { name: "asc" },
            }),
            this.prisma.chatRequest.findMany({
                where: {
                    status: {
                        in: [client_1.ChatRequestStatus.PENDING, client_1.ChatRequestStatus.APPROVED],
                    },
                    OR: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
                },
            }),
        ]);
        const blockedUserIds = new Set();
        for (const request of relatedRequests) {
            blockedUserIds.add(request.fromUserId === currentUserId ? request.toUserId : request.fromUserId);
        }
        return users
            .filter((user) => !blockedUserIds.has(user.id))
            .map((user) => this.serializeUser(user));
    }
    async getConnections(currentUserId) {
        await this.ensureCozyBotConnection(currentUserId);
        const requests = await this.prisma.chatRequest.findMany({
            where: {
                status: client_1.ChatRequestStatus.APPROVED,
                OR: [
                    { fromUserId: currentUserId },
                    { toUserId: currentUserId },
                ],
            },
            include: {
                fromUser: true,
                toUser: true,
            },
            orderBy: { updatedAt: "desc" },
        });
        const users = requests.map((request) => {
            const user = request.fromUserId === currentUserId ? request.toUser : request.fromUser;
            return this.serializeUser(user);
        });
        users.sort((left, right) => {
            const leftIsBot = (0, cozy_bot_constants_1.isCozyBotEmail)(left.email);
            const rightIsBot = (0, cozy_bot_constants_1.isCozyBotEmail)(right.email);
            if (leftIsBot && !rightIsBot) {
                return -1;
            }
            if (!leftIsBot && rightIsBot) {
                return 1;
            }
            return 0;
        });
        return users;
    }
    async findById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found.");
        }
        return user;
    }
    async ensureCozyBotConnection(userId) {
        const botUser = await this.ensureCozyBotUser();
        if (botUser.id === userId) {
            return botUser;
        }
        const existingConnection = await this.prisma.chatRequest.findFirst({
            where: {
                OR: [
                    {
                        fromUserId: botUser.id,
                        toUserId: userId,
                    },
                    {
                        fromUserId: userId,
                        toUserId: botUser.id,
                    },
                ],
            },
        });
        if (existingConnection) {
            if (existingConnection.status !== client_1.ChatRequestStatus.APPROVED) {
                await this.prisma.chatRequest.update({
                    where: { id: existingConnection.id },
                    data: {
                        status: client_1.ChatRequestStatus.APPROVED,
                    },
                });
            }
            return botUser;
        }
        await this.prisma.chatRequest.create({
            data: {
                fromUserId: botUser.id,
                toUserId: userId,
                status: client_1.ChatRequestStatus.APPROVED,
            },
        });
        return botUser;
    }
    async ensureCozyBotUser() {
        const existingBot = await this.prisma.user.findUnique({
            where: { email: cozy_bot_constants_1.COZY_BOT_EMAIL },
        });
        if (existingBot) {
            if (existingBot.name !== cozy_bot_constants_1.COZY_BOT_NAME ||
                existingBot.status !== client_1.UserStatus.ONLINE ||
                !existingBot.lastSeenAt) {
                return this.prisma.user.update({
                    where: { id: existingBot.id },
                    data: {
                        name: cozy_bot_constants_1.COZY_BOT_NAME,
                        status: client_1.UserStatus.ONLINE,
                        lastSeenAt: new Date(),
                    },
                });
            }
            return existingBot;
        }
        const passwordHash = await bcrypt.hash((0, crypto_1.randomBytes)(32).toString("hex"), 10);
        return this.prisma.user.create({
            data: {
                name: cozy_bot_constants_1.COZY_BOT_NAME,
                email: cozy_bot_constants_1.COZY_BOT_EMAIL,
                passwordHash,
                avatarUrl: null,
                status: client_1.UserStatus.ONLINE,
                lastSeenAt: new Date(),
            },
        });
    }
    serializeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            status: user.status,
            lastSeenAt: user.lastSeenAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map