import { AuthContext } from "@/context/AuthContext";
import { HomePostContext } from "@/context/HomePostContext";
import { ModalContext } from "@/context/ModalContext";
import { fetchCreatePost } from "@/utils/api/fetchPost";
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
        
        const response = await fetchCreatePost({
            state: "PUBLIC",
            content,
        });
        if (response.post) router.refresh();

        setContent("");
        
    }, [content]);

    return { content, setContent, handlePost };
}