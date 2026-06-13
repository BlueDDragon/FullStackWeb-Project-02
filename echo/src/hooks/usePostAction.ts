import { HomePostContext } from "@/context/HomePostContext";
import { ModalContext } from "@/context/ModalContext";
import { addPost } from "@/utils/service/postDataUtils";
import { useCallback, useContext, useState } from "react";

export function usePostAction() {
    const { openLoginModal } = useContext(ModalContext);
    const { updatePostStorage } = useContext(HomePostContext);
    
    const [content, setContent] = useState("");

    const handlePost = useCallback(() => {
        {
            openLoginModal();
            return;
        }
        
        addPost(content);
        setContent("");
        updatePostStorage();
    }, [content]);

    return { content, setContent, handlePost };
}