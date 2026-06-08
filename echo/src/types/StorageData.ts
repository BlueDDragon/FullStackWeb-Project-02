import { PostData } from "./PostData"

export type PostStorage = {
    posts: PostData[];
    
    nextIndex: number;
    updateAt: number;
}