'use client';

import { PostDetailContext } from "@/context/PostDetailContext";
import { usePostDetailContextAction } from "@/hooks/contetxt/usePostDetailContext";
import PostDetail from "./PostDetail";
import PostDetailChild from "./PostDetailChild";
import { PostGetResponse } from "@/types/ResponseData";

type PostProps = {
    response: PostGetResponse;
    userid: string;
    postid: string;
}

export default function Post({ response, userid, postid }: PostProps) {
    const posts = response.items;
    const rootPostId = posts.find((post) => post.id === Number(postid))?.rootPostId;

    return (
        <div>
            <PostDetailContext.Provider value={{ posts }}>
                {posts?.filter((post) => post.rootPostId === rootPostId)
                    .map((post) => {
                    if (post.id === Number(postid))
                        return <PostDetail key={post.id} post={post}/>
                    else
                        return <PostDetailChild key={post.id} post={post}/>
                })}
            </PostDetailContext.Provider>
        </div>
    );
}