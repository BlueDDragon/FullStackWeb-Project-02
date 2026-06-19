import { Prisma } from "@prisma/client";

export const USER_SELECT = 
    Prisma.validator<Prisma.UserSelect>()
    ({
        id: true,
        username: true,
        displayName: true,
        profileImgUrl: true,
    });
