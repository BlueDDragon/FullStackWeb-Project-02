import { HomePostContext } from "@/context/HomePostContext";
import { addPost } from "@/utils/service/postDataUtils";
import { useCallback, useContext, useState } from "react";

export function usePostAction() {
    const { updatePostStorage } = useContext(HomePostContext);
    
    const [content, setContent] = useState("");

    const handlePost = useCallback(() => {
        addPost(content);
        setContent("");
        updatePostStorage();
    }, [content]);

    return { content, setContent, handlePost };
}