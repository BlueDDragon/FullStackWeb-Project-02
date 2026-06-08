import { PostData } from "@/types/PostData";
import { getPostStorage } from "@/utils/service/postDataUtils";
import { useEffect, useState } from "react";

export function usePostDetailContextAction(initPostIdx: number) {
    const [posts, setPosts] = useState<PostData[]>([]);
    
    useEffect(() => {
        updatePosts(initPostIdx);
    }, [initPostIdx]);

    const updatePosts = (postIdx: number) => {
        const newPostStorage = getPostStorage();
        const rootPostIdx = newPostStorage.posts.find((post) => post.postIdx === postIdx)?.rootPostIdx;
        const newPosts = newPostStorage.posts.filter((post) => post.rootPostIdx === rootPostIdx);
        setPosts(newPosts);
    };

    return { posts };
}