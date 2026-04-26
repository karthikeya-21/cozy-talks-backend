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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("A user with this email already exists.");
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                avatarUrl: dto.avatarUrl,
            },
        });
        return this.buildAuthResponse(user);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid email or password.");
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid email or password.");
        }
        return this.buildAuthResponse(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found.");
        }
        return this.serializeUser(user);
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found.");
        }
        if (dto.email && dto.email !== user.email) {
            const conflictingUser = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (conflictingUser) {
                throw new common_1.ConflictException("That email is already in use.");
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name ?? user.name,
                email: dto.email ?? user.email,
                avatarUrl: Object.prototype.hasOwnProperty.call(dto, "avatarUrl")
                    ? (dto.avatarUrl ?? null)
                    : user.avatarUrl,
            },
        });
        return this.serializeUser(updatedUser);
    }
    async updatePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found.");
        }
        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException("Current password is incorrect.");
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
            },
        });
        return { success: true };
    }
    async deleteAccount(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found.");
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Password is incorrect.");
        }
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { success: true };
    }
    async buildAuthResponse(user) {
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });
        return {
            accessToken,
            user: this.serializeUser(user),
        };
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
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map