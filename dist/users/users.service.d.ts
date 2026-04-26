import { PrismaService } from "../prisma/prisma.service";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    discoverUsers(currentUserId: number, query?: string): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }[]>;
    getConnections(currentUserId: number): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }[]>;
    findById(userId: number): Promise<{
        email: string;
        name: string;
        avatarUrl: string | null;
        id: number;
        passwordHash: string;
        socketId: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        lastSeenAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private serializeUser;
}
