import { PostFindAllResponse, PostDetailResponse, PostCreateResponse } from "@/types/ResponseData";
import { api } from "./fetchServer";

export async function fetchPostCreate(state: string, content: string, userId: string, rootPostId?: number, parentPostId?: number) : Promise<PostCreateResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post`);

    const data = await api.post(apiURL, {
        ...(rootPostId ? {rootPostId: rootPostId} : {}),
        ...(parentPostId ? {parentPostId: parentPostId} : {}),
        state: state,
        content: content,
        like: 0,
        bookmark: 0,
        userId: userId,
    });
    if (!data) throw new Error(`response is null`);
    
    return data as PostCreateResponse;
}

export async function fetchPostFindAll(page: number = 1, limit: number = 10) : Promise<PostFindAllResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post`);
    apiURL.searchParams.append(`page`, String(page));
    apiURL.searchParams.append(`limit`, String(limit));

    const data = await api.get(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as PostFindAllResponse;
}

export async function fetchPostDetail(postid: number) : Promise<PostDetailResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post/detail/${postid}`);

    const data = await api.get(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as PostDetailResponse;
}