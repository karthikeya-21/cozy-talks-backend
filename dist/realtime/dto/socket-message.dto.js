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
exports.SocketMessageDto = void 0;
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class SocketMessageDto {
}
exports.SocketMessageDto = SocketMessageDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SocketMessageDto.prototype, "toUserId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], SocketMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MessageType),
    __metadata("design:type", String)
], SocketMessageDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocketMessageDto.prototype, "mediaUrl", void 0);
//# sourceMappingURL=socket-message.dto.js.map