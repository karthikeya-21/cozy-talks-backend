export declare function getAllowedOrigins(): string[];
export declare function isAllowedOrigin(origin?: string): boolean;
export declare function getCorsOptions(): {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
};
export declare function getSocketCorsOptions(): {
    origin: string[];
    credentials: boolean;
};
