import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthRequest } from "../interfaces/auth-request.interface";

export const CurrentAuth = createParamDecorator((
    field: keyof AuthRequest, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const auth: AuthRequest = {
            id: request.user.sub,
            username: request.user.username,
            displayname: request.user.displayname,
        };
        return field ? auth?.[field] : auth;
});