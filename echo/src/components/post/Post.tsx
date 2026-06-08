'use client';

import { PostDetailContext } from "@/context/PostDetailContext";
import { usePostDetailContextAction } from "@/hooks/contetxt/usePostDetailContext";
import PostDetail from "./PostDetail";
import PostDetailChild from "./PostDetailChild";

type PostProps = {
    id: string;
    postidx: string;
}

export default function Post({ id, postidx }: PostProps) {
    const { posts } = usePostDetailContextAction(Number(postidx));

    return (
        <div>
            <PostDetailContext.Provider value={{ posts }}>
                {posts?.map((post) => {
                    if (post.postIdx === Number(postidx))
                        return <PostDetail key={post.postIdx} post={post}/>
                    else
                        return <PostDetailChild key={post.postIdx} post={post}/>
                })}
            </PostDetailContext.Provider>
        </div>
    );
}