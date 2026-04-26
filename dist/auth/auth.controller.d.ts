import { AuthService } from "./auth.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            avatarUrl: string | null;
            status: unknown;
            lastSeenAt: Date | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            avatarUrl: string | null;
            status: unknown;
            lastSeenAt: Date | null;
        };
    }>;
    getProfile(user: {
        userId: number;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }>;
    updateProfile(user: {
        userId: number;
    }, dto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }>;
    updatePassword(user: {
        userId: number;
    }, dto: UpdatePasswordDto): Promise<{
        success: boolean;
    }>;
    deleteAccount(user: {
        userId: number;
    }, dto: DeleteAccountDto): Promise<{
        success: boolean;
    }>;
}
