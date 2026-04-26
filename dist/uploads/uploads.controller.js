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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const uploadsDirectory = (0, path_1.join)(process.cwd(), "uploads");
function ensureUploadsDirectory() {
    if (!(0, fs_1.existsSync)(uploadsDirectory)) {
        (0, fs_1.mkdirSync)(uploadsDirectory, { recursive: true });
    }
}
let UploadsController = class UploadsController {
    uploadImage(file, req) {
        if (!file) {
            throw new common_1.BadRequestException("Image file is required.");
        }
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        return {
            url: `${baseUrl}/uploads/${file.filename}`,
            filename: file.filename,
        };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)("image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, callback) => {
                ensureUploadsDirectory();
                callback(null, uploadsDirectory);
            },
            filename: (_req, file, callback) => {
                callback(null, `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (_req, file, callback) => {
            if (!file.mimetype.startsWith("image/")) {
                callback(new common_1.BadRequestException("Only image uploads are allowed."), false);
                return;
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadImage", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("uploads")
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map