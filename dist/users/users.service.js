"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async discoverUsers(currentUserId, query) {
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
        return requests.map((request) => {
            const user = request.fromUserId === currentUserId ? request.toUser : request.fromUser;
            return this.serializeUser(user);
        });
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
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map