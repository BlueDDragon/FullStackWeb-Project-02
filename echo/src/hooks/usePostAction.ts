import { AuthContext } from "@/context/AuthContext";
import { HomePostContext } from "@/context/HomePostContext";
import { ModalContext } from "@/context/ModalContext";
import { fetchPostCreate } from "@/utils/api/fetchPost";
import { addPost } from "@/utils/service/postDataUtils";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";

export function usePostAction() {
    const router = useRouter();
    const { auth } = useContext(AuthContext);

    const { openLoginModal } = useContext(ModalContext);
    const { updatePostStorage } = useContext(HomePostContext);
    
    const [content, setContent] = useState("");

    const handlePost = useCallback(async () => {
        if (!auth?.login) {
            openLoginModal();
            return;
        }
        
        // addPost(content);
        // updatePostStorage();
        
        const response = await fetchPostCreate("PUBLIC", content, "example00");
        if (response.post) router.refresh();

        setContent("");
        
    }, [content]);

    return { content, setContent, handlePost };
}