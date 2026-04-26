import { MessageType } from "@prisma/client";
export declare class CreateMessageDto {
    toUserId: number;
    content: string;
    type?: MessageType;
    mediaUrl?: string;
}
