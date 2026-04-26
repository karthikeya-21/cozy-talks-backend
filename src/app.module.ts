import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import type { StringValue } from "ms";

import { AuthModule } from "./auth/auth.module";
import { ChatRequestsModule } from "./chat-requests/chat-requests.module";
import { MessagesModule } from "./messages/messages.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "super-secret-jwt-key"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "7d") as StringValue,
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ChatRequestsModule,
    MessagesModule,
    RealtimeModule,
    UploadsModule,
  ],
})
export class AppModule {}
