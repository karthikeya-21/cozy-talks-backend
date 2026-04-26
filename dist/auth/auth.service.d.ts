import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        avatarUrl: string | null;
        status: unknown;
        lastSeenAt: Date | null;
    }>;
    updatePassword(userId: number, dto: UpdatePasswordDto): Promise<{
        success: boolean;
    }>;
    deleteAccount(userId: number, dto: DeleteAccountDto): Promise<{
        success: boolean;
    }>;
    private buildAuthResponse;
    private serializeUser;
}
