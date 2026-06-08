import { PostData } from "@/types/PostData";
import { loadData, saveData } from "../storage/storage";
import { PostStorage } from "@/types/StorageData";

export function getPostStorage() {
    return loadData<PostStorage>({ type: "Post" });
}

export function addPost(content: string) {
    const postStorage = getPostStorage();
    const isEmpty = (!postStorage || !Array.isArray(postStorage.posts) || postStorage.posts.length <= 0);

    const newCreateAt = Date.now();

    const newPost: PostData = {
        postIdx: (postStorage.nextIndex || 0),
        rootPostIdx: -1,
        parentPostIdx: -1,
        userId: "",
        nickname: "익명",
        content: content,
        state: "POST",
        createAt: newCreateAt,
        deleteAt: 0,
    }

    const newPostStorage: PostStorage = {
        posts: isEmpty ? [newPost] : [...postStorage.posts, newPost],
        nextIndex: (postStorage.nextIndex || 0) + 1,
        updateAt: newCreateAt,
    }

    saveData<PostStorage>({ type: "Post" }, newPostStorage);
}