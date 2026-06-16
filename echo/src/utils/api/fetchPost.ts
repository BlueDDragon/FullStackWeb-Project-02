import { PostFindAllResponse, PostDetailResponse, PostCreateResponse } from "@/types/ResponseData";
import { api } from "./fetchServer";
import { PostData } from "@/types/PostData";

export async function fetchPostCreateResponse(post: PostData, rootPostId?: number, parentPostId?: number) : Promise<PostCreateResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post`);

    const data = await api.post(apiURL, {
        rootPostId: rootPostId,
        parentPostId: parentPostId,
        state: post.state,
        content: post.content,
        userId: post.userId,
    });
    if (!data) throw new Error(`response is null`);
    
    return data as PostCreateResponse;
}

export async function fetchPostFindAllResponse(page: number = 1, limit: number = 10) : Promise<PostFindAllResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post`);
    apiURL.searchParams.append(`page`, String(page));
    apiURL.searchParams.append(`limit`, String(limit));

    const data = await api.get(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as PostFindAllResponse;
}

export async function fetchPostDetailResponse(postid: number) : Promise<PostDetailResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post/detail/${postid}`);

    const data = await api.get(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as PostDetailResponse;
}