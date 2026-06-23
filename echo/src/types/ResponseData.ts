import { PostData, PostState } from "./PostData";

export interface CreatePostResponse {
    post: PostData;
}

export interface GetPostsResponse {
    posts: PostData[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    }
}

export interface GetPostThreadResponse {
    post: PostData;
    posts: PostData[];
}

export interface AuthLoginResponse {
    login: boolean;
    accessToken: string;
    user: {
        userId: string;
        username: string;
        profileImageUrl: string;
        createdAt: string;
    }
}

export interface AuthMeResponse {
    login: boolean;
    user: {
        userId: string;
        username: string;
        profileImageUrl: string;
        createdAt: string;
    }
}