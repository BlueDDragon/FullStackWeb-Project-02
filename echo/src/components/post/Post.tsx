'use client';

import { PostDetailContext } from "@/context/PostDetailContext";
import PostDetail from "./PostDetail";
import { GetPostThreadResponse } from "@/types/ResponseData";
import { PostData } from "@/types/PostData";

type PostProps = {
    response: GetPostThreadResponse;
    postId: number;
}

export default function Post({ response, postId }: PostProps) {
    const { posts } = response;

    return (
        <div>
            <PostDetailContext.Provider value={{ posts }}>
                {posts?.map((p) => postChildren(p))}
            </PostDetailContext.Provider>
        </div>
    );
}

function postChildren(post: PostData) {
    return (
        <div>
            <PostDetail key={post.id} post={post} isFocus={false}/>
            {post.children.length > 0 && post.children.map((p) => postChildren(p))}
        </div>
    );
}