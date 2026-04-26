type KnowledgeEntry = {
    id: string;
    keywords: string[];
    answer: string;
};
export declare const cozyBotKnowledge: KnowledgeEntry[];
export declare function findKnowledgeAnswer(message: string): string | null;
export {};
