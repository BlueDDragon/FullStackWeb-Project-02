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
    like: number;
    bookmarks: number;
    createdAt: string;
    updatedAt: string;
}