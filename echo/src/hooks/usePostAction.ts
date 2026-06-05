import { addPost } from "@/utils/service/postDataUtils";
import { useCallback, useState } from "react";

export function usePostAction() {
    const [content, setContent] = useState("");

    const handlePost = useCallback(() => {
        addPost(content);
        setContent("");
    }, [content]);

    return { content, setContent, handlePost };
}