'use client';

import { PostDetailContext } from "@/context/PostDetailContext";
import PostDetail from "./PostDetail";
import { PostDetailResponse } from "@/types/ResponseData";

type PostProps = {
    response: PostDetailResponse;
    postid: string;
}

export default function Post({ response, postid }: PostProps) {
    const { post, posts } = response;

    return (
        <div>
            <PostDetailContext.Provider value={{ posts }}>
                {posts?.map((p) => <PostDetail key={p.id} post={p} isFocus={post.id === p.id}/>)}
            </PostDetailContext.Provider>
        </div>
    );
}