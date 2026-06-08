import { PostData } from "@/types/PostData";
import { createContext } from "react";

type PostDetailContextType = {
    posts: PostData[] | undefined;
};

export const PostDetailContext = createContext<PostDetailContextType>( {
    posts: [],
});