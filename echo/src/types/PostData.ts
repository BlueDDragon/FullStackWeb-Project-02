import { UserData } from "./AuthData";

export enum PostState {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    NOTICE = "NOTICE",
    DELETED = "DELETED",
    ERROR = "ERROR",
}

export interface PostData {
    id: number;
    rootPostId: number;
    parentPostId: number;
    state: PostState;
    content: string;

    author: UserData;

    createdAt: string;
    updatedAt: string;

    images: {
        imgUrl: string;
    }[];

    children: PostData[];
}