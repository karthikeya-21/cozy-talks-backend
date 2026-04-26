import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("A user with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        avatarUrl: dto.avatarUrl,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return this.serializeUser(user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (dto.email && dto.email !== user.email) {
      const conflictingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (conflictingUser) {
        throw new ConflictException("That email is already in use.");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name ?? user.name,
        email: dto.email ?? user.email,
        avatarUrl: Object.prototype.hasOwnProperty.call(dto, "avatarUrl")
          ? (dto.avatarUrl ?? null)
          : user.avatarUrl,
      },
    });

    return this.serializeUser(updatedUser);
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect.");
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    return { success: true };
  }

  async deleteAccount(userId: number, dto: DeleteAccountDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Password is incorrect.");
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }

  private async buildAuthResponse(user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
    status: unknown;
    lastSeenAt: Date | null;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: this.serializeUser(user),
    };
  }

  private serializeUser(user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
    status: unknown;
    lastSeenAt: Date | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
      lastSeenAt: user.lastSeenAt,
    };
  }
}
