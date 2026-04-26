import { forwardRef, Module } from "@nestjs/common";

import { RealtimeModule } from "../realtime/realtime.module";
import { ChatRequestsController } from "./chat-requests.controller";
import { ChatRequestsService } from "./chat-requests.service";

@Module({
  imports: [forwardRef(() => RealtimeModule)],
  controllers: [ChatRequestsController],
  providers: [ChatRequestsService],
  exports: [ChatRequestsService],
})
export class ChatRequestsModule {}
