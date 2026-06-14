import { PostData, PostState } from "@/types/PostData";
import { loadData, saveData } from "../storage/storage";
import { PostStorage } from "@/types/StorageData";

export function getPostStorage() {
    return loadData<PostStorage>({ type: "Post" });
}

export function addPost(content: string) {
    const postStorage = getPostStorage();
    const isEmpty = (!postStorage || !Array.isArray(postStorage.posts) || postStorage.posts.length <= 0);

    // const newPost: PostData = {
    //     rootPostId: -1,
    //     parentPostId: -1,
    //     // userId: "",
    //     // username: "익명",
    //     content: content,
    //     state: PostState.PUBLIC,
    // }

    // const newPostStorage: PostStorage = {
    //     posts: isEmpty ? [newPost] : [...postStorage.posts, newPost],
    //     nextIndex: (postStorage.nextIndex || 0) + 1,
    // }

    // saveData<PostStorage>({ type: "Post" }, newPostStorage);
}