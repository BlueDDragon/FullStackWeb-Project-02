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