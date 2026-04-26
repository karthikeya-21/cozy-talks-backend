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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
const messages_service_1 = require("../messages/messages.service");
const cors_config_1 = require("../config/cors.config");
const realtime_events_service_1 = require("./realtime-events.service");
const socket_message_dto_1 = require("./dto/socket-message.dto");
let ChatGateway = class ChatGateway {
    constructor(jwtService, prisma, messagesService, realtimeEvents) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.messagesService = messagesService;
        this.realtimeEvents = realtimeEvents;
    }
    async handleConnection(client) {
        const token = this.extractToken(client);
        if (!token) {
            client.disconnect();
            return;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            client.data.userId = payload.sub;
            client.join(this.userRoom(payload.sub));
            this.realtimeEvents.registerServer(this.server);
            await this.prisma.user.update({
                where: { id: payload.sub },
                data: {
                    socketId: client.id,
                    status: client_1.UserStatus.ONLINE,
                    lastSeenAt: new Date(),
                },
            });
            this.server.emit("presence:update", {
                userId: payload.sub,
                status: client_1.UserStatus.ONLINE,
                lastSeenAt: new Date(),
            });
        }
        catch {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const userId = client.data.userId;
        if (!userId) {
            return;
        }
        const remainingSockets = await this.server.in(this.userRoom(userId)).fetchSockets();
        if (remainingSockets.length > 0) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    socketId: remainingSockets[0].id,
                    status: client_1.UserStatus.ONLINE,
                },
            });
            return;
        }
        const disconnectedAt = new Date();
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                socketId: null,
                status: client_1.UserStatus.OFFLINE,
                lastSeenAt: disconnectedAt,
            },
        });
        this.server.emit("presence:update", {
            userId,
            status: client_1.UserStatus.OFFLINE,
            lastSeenAt: disconnectedAt,
        });
    }
    async handleMessage(client, payload) {
        const fromUserId = client.data.userId;
        if (!fromUserId) {
            throw new common_1.BadRequestException("Unauthenticated socket connection.");
        }
        const message = await this.messagesService.create(fromUserId, {
            toUserId: payload.toUserId,
            content: payload.content,
            type: payload.type ?? client_1.MessageType.TEXT,
            mediaUrl: payload.mediaUrl,
        });
        this.server.to(this.userRoom(fromUserId)).emit("message:received", message);
        this.server.to(this.userRoom(payload.toUserId)).emit("message:received", message);
        return message;
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token;
        if (authToken) {
            return authToken;
        }
        const authorizationHeader = client.handshake.headers.authorization;
        if (!authorizationHeader) {
            return null;
        }
        const [scheme, token] = authorizationHeader.split(" ");
        if (scheme?.toLowerCase() !== "bearer" || !token) {
            return null;
        }
        return token;
    }
    userRoom(userId) {
        return `user:${userId}`;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    (0, websockets_1.SubscribeMessage)("message:send"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        socket_message_dto_1.SocketMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "chat",
        cors: (0, cors_config_1.getSocketCorsOptions)(),
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        messages_service_1.MessagesService,
        realtime_events_service_1.RealtimeEventsService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map