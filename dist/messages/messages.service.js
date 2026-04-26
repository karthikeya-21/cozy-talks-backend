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
var MessagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const ai_service_1 = require("../ai/ai.service");
const chat_requests_service_1 = require("../chat-requests/chat-requests.service");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_events_service_1 = require("../realtime/realtime-events.service");
const users_service_1 = require("../users/users.service");
let MessagesService = MessagesService_1 = class MessagesService {
    constructor(prisma, chatRequestsService, usersService, aiService, realtimeEvents) {
        this.prisma = prisma;
        this.chatRequestsService = chatRequestsService;
        this.usersService = usersService;
        this.aiService = aiService;
        this.realtimeEvents = realtimeEvents;
        this.logger = new common_1.Logger(MessagesService_1.name);
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
        const serializedMessage = {
            id: message.id,
            fromUserId: message.fromUserId,
            toUserId: message.toUserId,
            senderName: message.fromUser.name,
            content: message.content,
            type: message.type,
            mediaUrl: message.mediaUrl,
            createdAt: message.createdAt,
        };
        void this.maybeReplyAsCozyBot(serializedMessage).catch((error) => {
            const errorMessage = error instanceof Error ? error.message : "Unknown Cozy Bot reply error.";
            this.logger.error(`Failed to create Cozy Bot reply: ${errorMessage}`);
        });
        return serializedMessage;
    }
    async maybeReplyAsCozyBot(message) {
        const cozyBot = await this.usersService.ensureCozyBotUser();
        if (message.toUserId !== cozyBot.id || message.fromUserId === cozyBot.id) {
            return;
        }
        const conversation = await this.prisma.message.findMany({
            where: {
                OR: [
                    {
                        fromUserId: message.fromUserId,
                        toUserId: cozyBot.id,
                    },
                    {
                        fromUserId: cozyBot.id,
                        toUserId: message.fromUserId,
                    },
                ],
            },
            include: {
                fromUser: true,
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        const botReply = await this.aiService.generateCozyBotReply({
            userName: message.senderName,
            conversation: conversation.reverse().map((item) => ({
                role: item.fromUserId === cozyBot.id ? "assistant" : "user",
                content: item.type === client_1.MessageType.IMAGE
                    ? `[Image message]${item.content && item.content !== "Image" ? ` ${item.content}` : ""}`
                    : item.content,
            })),
        });
        const botMessage = await this.prisma.message.create({
            data: {
                fromUserId: cozyBot.id,
                toUserId: message.fromUserId,
                content: botReply,
                type: client_1.MessageType.TEXT,
            },
            include: {
                fromUser: true,
            },
        });
        const serializedReply = {
            id: botMessage.id,
            fromUserId: botMessage.fromUserId,
            toUserId: botMessage.toUserId,
            senderName: botMessage.fromUser.name,
            content: botMessage.content,
            type: botMessage.type,
            mediaUrl: botMessage.mediaUrl,
            createdAt: botMessage.createdAt,
        };
        this.realtimeEvents.emitToUsers([serializedReply.fromUserId, serializedReply.toUserId], "message:received", serializedReply);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = MessagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_requests_service_1.ChatRequestsService,
        users_service_1.UsersService,
        ai_service_1.AiService,
        realtime_events_service_1.RealtimeEventsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map