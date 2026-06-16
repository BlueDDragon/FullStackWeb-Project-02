import { PostData, PostState } from "./PostData";

export interface PostCreateResponse {
    post: PostData;
}

export interface PostFindAllResponse {
    posts: PostData[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface PostDetailResponse {
    post: PostData;
    posts: PostData[];
}

export interface AuthLoginResponse {
    login: boolean;
    accessToken: string;
    user: {
        sub: string;
        userId: string;
        username: string;
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