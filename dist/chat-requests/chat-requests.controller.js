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
exports.ChatRequestsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const chat_requests_service_1 = require("./chat-requests.service");
const create_chat_request_dto_1 = require("./dto/create-chat-request.dto");
const update_chat_request_dto_1 = require("./dto/update-chat-request.dto");
let ChatRequestsController = class ChatRequestsController {
    constructor(chatRequestsService) {
        this.chatRequestsService = chatRequestsService;
    }
    list(user) {
        return this.chatRequestsService.list(user.userId);
    }
    create(user, dto) {
        return this.chatRequestsService.create(user.userId, dto);
    }
    update(user, id, dto) {
        return this.chatRequestsService.update(user.userId, id, dto.action);
    }
};
exports.ChatRequestsController = ChatRequestsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatRequestsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_chat_request_dto_1.CreateChatRequestDto]),
    __metadata("design:returntype", void 0)
], ChatRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_chat_request_dto_1.UpdateChatRequestDto]),
    __metadata("design:returntype", void 0)
], ChatRequestsController.prototype, "update", null);
exports.ChatRequestsController = ChatRequestsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("chat-requests"),
    __metadata("design:paramtypes", [chat_requests_service_1.ChatRequestsService])
], ChatRequestsController);
//# sourceMappingURL=chat-requests.controller.js.map