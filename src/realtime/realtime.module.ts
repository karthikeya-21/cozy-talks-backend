import { forwardRef, Module } from "@nestjs/common";

import { MessagesModule } from "../messages/messages.module";
import { ChatGateway } from "./chat.gateway";
import { RealtimeEventsService } from "./realtime-events.service";

@Module({
  imports: [forwardRef(() => MessagesModule)],
  providers: [ChatGateway, RealtimeEventsService],
  exports: [RealtimeEventsService],
})
export class RealtimeModule {}
