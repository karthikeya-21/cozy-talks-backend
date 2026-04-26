import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from "@nestjs/common";

import { CurrentUser } from "./current-user.decorator";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProfile(@CurrentUser() user: { userId: number }) {
    return this.authService.getProfile(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateProfile(
    @CurrentUser() user: { userId: number },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("me/password")
  updatePassword(
    @CurrentUser() user: { userId: number },
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("me")
  deleteAccount(
    @CurrentUser() user: { userId: number },
    @Body() dto: DeleteAccountDto,
  ) {
    return this.authService.deleteAccount(user.userId, dto);
  }
}
