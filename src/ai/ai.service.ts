import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { findKnowledgeAnswer } from "./cozy-bot-knowledge";

type BotConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

function getConversationalFallback(message: string) {
  const normalized = message.toLowerCase().trim();

  if (/\b(hi|hello|hey|hii|hola)\b/.test(normalized)) {
    return "Hello! I am Cozy Bot. I can help with CozyTalks features, your developer profile, and general app guidance.";
  }

  if (/\b(good morning|good afternoon|good evening)\b/.test(normalized)) {
    return "Hello! Nice to hear from you. I am Cozy Bot, and I am here to help with the app and your developer details.";
  }

  if (/\b(how are you|how are you doing|how's it going)\b/.test(normalized)) {
    return "I am doing well and ready to help. You can ask me about CozyTalks, app flows, or the developer profile.";
  }

  if (/\b(thank you|thanks|thx)\b/.test(normalized)) {
    return "You are welcome. Ask me anything about CozyTalks or the developer profile whenever you want.";
  }

  if (/\b(who are you|introduce yourself)\b/.test(normalized)) {
    return "I am Cozy Bot, your built-in helper inside CozyTalks. I can answer app questions, explain features, and share developer details from the local knowledge base.";
  }

  return null;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateCozyBotReply(params: {
    userName: string;
    conversation: BotConversationTurn[];
  }) {
    const latestUserMessage = [...params.conversation].reverse().find((turn) => turn.role === "user")?.content ?? "";
    const conversationalFallback = getConversationalFallback(latestUserMessage);
    const knowledgeAnswer = findKnowledgeAnswer(latestUserMessage);

    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      if (conversationalFallback) {
        return conversationalFallback;
      }

      if (knowledgeAnswer) {
        return knowledgeAnswer;
      }

      return "I do not know that yet. I can already help with common CozyTalks questions like login, registration, chat requests, profile updates, password reset, image sending, and how connections work.";
    }

    const model = this.configService.get<string>("OPENAI_MODEL", "gpt-5-mini");
    const vectorStoreIds = (this.configService.get<string>("OPENAI_VECTOR_STORE_IDS") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const instructions = [
      "You are Cozy Bot inside the CozyTalks chat app.",
      "Reply like a helpful built-in chat contact, not like an agent.",
      "Keep replies concise, friendly, and practical.",
      "If the user asks about CozyTalks app features and the answer is not grounded in the provided conversation or retrieved files, say you are not fully sure instead of inventing details.",
      `The current end user chatting with you is ${params.userName}.`,
    ].join(" ");

    const requestBody: Record<string, unknown> = {
      model,
      instructions,
      input: params.conversation.map((turn) => ({
        role: turn.role,
        content: turn.content,
      })),
    };

    if (vectorStoreIds.length > 0) {
      requestBody.tools = [
        {
          type: "file_search",
          vector_store_ids: vectorStoreIds,
          max_num_results: 3,
        },
      ];
    }

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
        output_text?: string;
        output?: Array<{
          type?: string;
          role?: string;
          content?: Array<{ type?: string; text?: string }>;
        }>;
      };

      if (!response.ok) {
        const errorMessage = payload.error?.message ?? "OpenAI request failed.";
        this.logger.error(`OpenAI response error: ${errorMessage}`);
        return knowledgeAnswer ?? "I ran into a temporary problem while thinking about that. Please try again in a moment.";
      }

      const text = this.extractText(payload);
      if (text) {
        return text;
      }

      this.logger.warn("OpenAI response completed without output text.");
      return knowledgeAnswer ?? "I could not form a clean reply just now. Please try asking that again.";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown AI error.";
      this.logger.error(`OpenAI request failed: ${message}`);
      return knowledgeAnswer ?? "I am having trouble replying right now. Please try again in a moment.";
    }
  }

  private extractText(payload: {
    output_text?: string;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
  }) {
    if (payload.output_text?.trim()) {
      return payload.output_text.trim();
    }

    const fragments =
      payload.output
        ?.filter((item) => item.type === "message")
        .flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text" && typeof content.text === "string")
        .map((content) => content.text?.trim())
        .filter((content): content is string => Boolean(content)) ?? [];

    return fragments.join("\n").trim();
  }
}
