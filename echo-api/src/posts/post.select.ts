import { Prisma } from "@prisma/client";

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
        author: { select: { username: true, displayName: true, profileImgUrl: true }},
        images: { select: { imgUrl: true }},
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
