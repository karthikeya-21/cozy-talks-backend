import { MessageType } from "@prisma/client";
export declare class SocketMessageDto {
    toUserId: number;
    content: string;
    type?: MessageType;
    mediaUrl?: string;
}
