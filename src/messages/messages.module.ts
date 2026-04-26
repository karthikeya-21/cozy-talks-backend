import { forwardRef, Module } from "@nestjs/common";

import { AiModule } from "../ai/ai.module";
import { ChatRequestsModule } from "../chat-requests/chat-requests.module";
import { RealtimeModule } from "../realtime/realtime.module";
import { UsersModule } from "../users/users.module";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";

@Module({
  imports: [AiModule, forwardRef(() => ChatRequestsModule), forwardRef(() => RealtimeModule), UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
