import { ConfigService } from "@nestjs/config";
type BotConversationTurn = {
    role: "user" | "assistant";
    content: string;
};
export declare class AiService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    generateCozyBotReply(params: {
        userName: string;
        conversation: BotConversationTurn[];
    }): Promise<string>;
    private extractText;
}
export {};
