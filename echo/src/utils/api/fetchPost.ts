import { PostGetResponse } from "@/types/ResponseData";
import { fetchData } from "./fetchServer";

export async function fetchPostGetResponse(page: number = 1, limit: number = 10) : Promise<PostGetResponse> {
    let apiURL = `${process.env.NEXT_PUBLIC_API_URL}/post`;
    apiURL += `?page=${page}`;
    apiURL += `&limit=${limit}`;

    const data = await fetchData(apiURL);
    if (!data) throw new Error(`response is null`);
    
    return data as PostGetResponse;
}

export async function fetchPostPostResponse() : Promise<PostGetResponse | undefined> {
    let apiURL = `${process.env.NEXT_PUBLIC_API_URL}/post`;

    const data = await fetchData(apiURL);
    return data as PostGetResponse;
}