import { CreatePostResponse, GetPostsResponse, GetPostThreadResponse } from "@/types/ResponseData";
import { api } from "./fetchServer";

type CreatePostDto = {
    rootPostId?: number;
    parentPostId?: number;
    state: string;
    content: string;
}

export async function fetchCreatePost(body: CreatePostDto) : Promise<CreatePostResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/posts`);

    const data = await api.post(apiURL, {
        ...(body.rootPostId ? {rootPostId: body.rootPostId} : {}),
        ...(body.parentPostId ? {parentPostId: body.parentPostId} : {}),
        state: body.state,
        content: body.content,
    });
    if (!data) throw new Error(`response is null`);
    
    return data as CreatePostResponse;
}

export async function fetchGetPosts(page: number = 1, limit: number = 10) : Promise<GetPostsResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    apiURL.searchParams.append(`page`, String(page));
    apiURL.searchParams.append(`limit`, String(limit));

    const data = await api.get(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as GetPostsResponse;
}

export async function fetchGetPostsThread(postId: number) : Promise<GetPostThreadResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/thread`);

    const data = await api.get(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as GetPostThreadResponse;
}