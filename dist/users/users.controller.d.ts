import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    discoverUsers(user: {
        userId: number;
    }, query?: string): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }[]>;
    getConnections(user: {
        userId: number;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }[]>;
}
