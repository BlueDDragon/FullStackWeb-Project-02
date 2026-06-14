'use client';

import { PostDetailContext } from "@/context/PostDetailContext";
import { usePostDetailContextAction } from "@/hooks/contetxt/usePostDetailContext";
import PostDetail from "./PostDetail";
import { PostGetResponse } from "@/types/ResponseData";

type PostProps = {
    response: PostGetResponse;
    postid: string;
}

export default function Post({ response, postid }: PostProps) {
    const posts = response.items;
    const rootPostId = posts.find((post) => post.id === Number(postid))?.rootPostId;

    return (
        <div>
            <PostDetailContext.Provider value={{ posts }}>
                {posts?.filter((post) => post.rootPostId === rootPostId)
                    .map((post) => <PostDetail key={post.id} post={post} isFocus={post.id === Number(postid)}/>)}
            </PostDetailContext.Provider>
        </div>
    );
}