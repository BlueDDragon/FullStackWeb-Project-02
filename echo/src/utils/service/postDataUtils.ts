import { PostData } from "@/types/PostData";
import { loadData, saveData } from "../storage/storage";
import { PostStorage } from "@/types/StorageData";

export function getPostData() {
    return loadData<PostStorage>({ type: "Post" });
}

export function addPost(content: string) {
    const postData = getPostData();
    const isEmpty = (!postData || !Array.isArray(postData) || postData.length <= 0);

    const newCreateAt = String(Date.now());

    const newPost: PostData = {
        index: (isEmpty ? 0 : postData.nextIndex),
        originIndex: -1,
        userId: "",
        nickname: "익명",
        content: content,
        state: "POST",
        createAt: newCreateAt,
        deleteAt: ""
    }

    const newPostStorage: PostStorage = {
        posts: isEmpty ? [newPost] : [...postData.posts, newPost],
        nextIndex: postData.nextIndex + 1,
        updateAt: newCreateAt,
    }

    saveData<PostStorage>({ type: "Post" }, newPostStorage);
}