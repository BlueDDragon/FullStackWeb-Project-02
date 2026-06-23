import { UserData } from "./AuthData";
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
    user: UserData;
}

export interface AuthMeResponse {
    login: boolean;
    user: UserData;
}