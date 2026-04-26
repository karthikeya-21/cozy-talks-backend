import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface AuthenticatedRequestUser {
  userId: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedRequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthenticatedRequestUser;
  },
);
