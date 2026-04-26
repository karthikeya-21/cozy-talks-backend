import { forwardRef, Module } from "@nestjs/common";

import { ChatRequestsModule } from "../chat-requests/chat-requests.module";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";

@Module({
  imports: [forwardRef(() => ChatRequestsModule)],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
