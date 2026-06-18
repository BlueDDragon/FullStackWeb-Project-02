import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface AuthUser {
    id: string;
    userId: string;
    username: string;
}

export const CurrentAuth = createParamDecorator((
    field: keyof AuthUser, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: AuthUser = request.user;
        return field ? user?.[field] : user;
});