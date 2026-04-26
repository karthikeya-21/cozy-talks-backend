import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("discover")
  discoverUsers(
    @CurrentUser() user: { userId: number },
    @Query("query") query?: string,
  ) {
    return this.usersService.discoverUsers(user.userId, query);
  }

  @Get("connections")
  getConnections(@CurrentUser() user: { userId: number }) {
    return this.usersService.getConnections(user.userId);
  }
}
