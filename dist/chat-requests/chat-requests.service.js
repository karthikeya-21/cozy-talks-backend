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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRequestsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_events_service_1 = require("../realtime/realtime-events.service");
const update_chat_request_dto_1 = require("./dto/update-chat-request.dto");
let ChatRequestsService = class ChatRequestsService {
    constructor(prisma, realtimeEvents) {
        this.prisma = prisma;
        this.realtimeEvents = realtimeEvents;
    }
    async create(currentUserId, dto) {
        if (currentUserId === dto.targetUserId) {
            throw new common_1.BadRequestException("You cannot send a chat request to yourself.");
        }
        const existingRequest = await this.prisma.chatRequest.findFirst({
            where: {
                OR: [
                    {
                        fromUserId: currentUserId,
                        toUserId: dto.targetUserId,
                    },
                    {
                        fromUserId: dto.targetUserId,
                        toUserId: currentUserId,
                    },
                ],
            },
        });
        if (existingRequest) {
            throw new common_1.ConflictException("A chat request or connection already exists for these users.");
        }
        let createdRequest;
        try {
            createdRequest = await this.prisma.chatRequest.create({
                data: {
                    fromUserId: currentUserId,
                    toUserId: dto.targetUserId,
                    status: client_1.ChatRequestStatus.PENDING,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new common_1.ConflictException("A chat request or connection already exists for these users.");
            }
            throw error;
        }
        this.realtimeEvents.emitToUsers([currentUserId, dto.targetUserId], "chat-request:created", {
            id: createdRequest.id,
            fromUserId: createdRequest.fromUserId,
            toUserId: createdRequest.toUserId,
            status: createdRequest.status,
        });
        return createdRequest;
    }
    async list(currentUserId) {
        const items = await this.prisma.chatRequest.findMany({
            where: {
                status: client_1.ChatRequestStatus.PENDING,
                OR: [
                    { fromUserId: currentUserId },
                    { toUserId: currentUserId },
                ],
            },
            include: {
                fromUser: true,
                toUser: true,
            },
            orderBy: { createdAt: "asc" },
        });
        return items.map((item) => {
            const isSender = item.fromUserId === currentUserId;
            const otherUser = isSender ? item.toUser : item.fromUser;
            return {
                id: item.id,
                fromUserId: item.fromUserId,
                toUserId: item.toUserId,
                status: item.status,
                notificationType: isSender ? "Send Request" : "Receive Request",
                user: {
                    id: otherUser.id,
                    name: otherUser.name,
                    email: otherUser.email,
                    avatarUrl: otherUser.avatarUrl,
                },
            };
        });
    }
    async update(currentUserId, requestId, action) {
        const request = await this.prisma.chatRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException("Chat request not found.");
        }
        if (request.toUserId !== currentUserId) {
            throw new common_1.BadRequestException("Only the receiving user can process this request.");
        }
        if (request.status !== client_1.ChatRequestStatus.PENDING) {
            throw new common_1.ConflictException("This chat request has already been processed.");
        }
        const updatedRequest = await this.prisma.chatRequest.update({
            where: { id: requestId },
            data: {
                status: action === update_chat_request_dto_1.ChatRequestAction.APPROVE
                    ? client_1.ChatRequestStatus.APPROVED
                    : client_1.ChatRequestStatus.REJECTED,
            },
        });
        this.realtimeEvents.emitToUsers([updatedRequest.fromUserId, updatedRequest.toUserId], "chat-request:updated", {
            id: updatedRequest.id,
            fromUserId: updatedRequest.fromUserId,
            toUserId: updatedRequest.toUserId,
            status: updatedRequest.status,
        });
        return updatedRequest;
    }
    async areUsersConnected(firstUserId, secondUserId) {
        const request = await this.prisma.chatRequest.findFirst({
            where: {
                status: client_1.ChatRequestStatus.APPROVED,
                OR: [
                    { fromUserId: firstUserId, toUserId: secondUserId },
                    { fromUserId: secondUserId, toUserId: firstUserId },
                ],
            },
        });
        return Boolean(request);
    }
};
exports.ChatRequestsService = ChatRequestsService;
exports.ChatRequestsService = ChatRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_events_service_1.RealtimeEventsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_events_service_1.RealtimeEventsService])
], ChatRequestsService);
//# sourceMappingURL=chat-requests.service.js.map