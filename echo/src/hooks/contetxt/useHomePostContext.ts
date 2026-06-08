import { PostStorage } from "@/types/StorageData";
import { getPostStorage } from "@/utils/service/postDataUtils";
import { useEffect, useState } from "react";

export function useHomePostContextAction() {
    const [postStorage, setPostStorage] = useState<PostStorage>();
    const [isPostEmpty, setIsPostEmpty] = useState<boolean>(false);
    
    useEffect(() => {
        updatePostStorage();
    }, []);

    const updatePostStorage = () => {
        const newPostStorage = getPostStorage();
        setPostStorage(newPostStorage);
        setIsPostEmpty(!newPostStorage || !Array.isArray(newPostStorage.posts) || newPostStorage.posts.length <= 0);
    };

    return { postStorage, isPostEmpty, updatePostStorage };
}