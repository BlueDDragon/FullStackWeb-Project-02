import { PostData } from "./PostData"

export interface PostStorage {
    posts: PostData[];
    
    nextIndex: number;
    updateAt: number;
}