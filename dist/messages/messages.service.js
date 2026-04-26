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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const chat_requests_service_1 = require("../chat-requests/chat-requests.service");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    constructor(prisma, chatRequestsService) {
        this.prisma = prisma;
        this.chatRequestsService = chatRequestsService;
    }
    async getConversation(currentUserId, otherUserId) {
        const isConnected = await this.chatRequestsService.areUsersConnected(currentUserId, otherUserId);
        if (!isConnected) {
            throw new common_1.BadRequestException("Users must be connected before reading messages.");
        }
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    {
                        fromUserId: currentUserId,
                        toUserId: otherUserId,
                    },
                    {
                        fromUserId: otherUserId,
                        toUserId: currentUserId,
                    },
                ],
            },
            include: {
                fromUser: true,
            },
            orderBy: { createdAt: "asc" },
        });
        return messages.map((message) => ({
            id: message.id,
            fromUserId: message.fromUserId,
            toUserId: message.toUserId,
            senderName: message.fromUser.name,
            content: message.content,
            type: message.type,
            mediaUrl: message.mediaUrl,
            createdAt: message.createdAt,
        }));
    }
    async create(currentUserId, dto) {
        const isConnected = await this.chatRequestsService.areUsersConnected(currentUserId, dto.toUserId);
        if (!isConnected) {
            throw new common_1.BadRequestException("Users must be connected before sending messages.");
        }
        const message = await this.prisma.message.create({
            data: {
                fromUserId: currentUserId,
                toUserId: dto.toUserId,
                content: dto.content,
                type: dto.type ?? client_1.MessageType.TEXT,
                mediaUrl: dto.mediaUrl,
            },
            include: {
                fromUser: true,
            },
        });
        return {
            id: message.id,
            fromUserId: message.fromUserId,
            toUserId: message.toUserId,
            senderName: message.fromUser.name,
            content: message.content,
            type: message.type,
            mediaUrl: message.mediaUrl,
            createdAt: message.createdAt,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_requests_service_1.ChatRequestsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map