"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("./auth/auth.module");
const chat_requests_module_1 = require("./chat-requests/chat-requests.module");
const messages_module_1 = require("./messages/messages.module");
const prisma_module_1 = require("./prisma/prisma.module");
const realtime_module_1 = require("./realtime/realtime.module");
const uploads_module_1 = require("./uploads/uploads.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get("JWT_SECRET", "super-secret-jwt-key"),
                    signOptions: {
                        expiresIn: configService.get("JWT_EXPIRES_IN", "7d"),
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            chat_requests_module_1.ChatRequestsModule,
            messages_module_1.MessagesModule,
            realtime_module_1.RealtimeModule,
            uploads_module_1.UploadsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map