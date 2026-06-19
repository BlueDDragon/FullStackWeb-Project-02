import { Prisma } from "@prisma/client";
import { USER_SELECT } from "../users/user.select";

export const POST_IMAGE_SELECT = 
    Prisma.validator<Prisma.PostImageSelect>()
    ({
        imgUrl: true,
    });

export const POST_SELECT = 
    Prisma.validator<Prisma.PostSelect>()
    ({
        id: true,
        state: true,
        content: true,
        authorId: true,
        rootPostId: true,
        parentPostId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: USER_SELECT },
        images: { select: POST_IMAGE_SELECT },
    });

export const POST_ORDERBY = {
    OLDEST: Prisma.validator<Prisma.PostOrderByWithRelationInput>()
    ({
        createdAt: 'asc',
    }),

    NEWEST: Prisma.validator<Prisma.PostOrderByWithRelationInput>()
    ({
        createdAt: 'desc',
    }),

    UPDATED: Prisma.validator<Prisma.PostOrderByWithRelationInput>()
    ({
        updatedAt: 'desc',
    }),
};
