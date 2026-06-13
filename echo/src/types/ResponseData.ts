import { PostData, PostState } from "./PostData";

export interface PostGetResponse {
    items: PostData[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}
