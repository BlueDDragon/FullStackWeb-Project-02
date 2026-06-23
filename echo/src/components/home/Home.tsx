'use client';

import { HomePostContext } from "@/context/HomePostContext";
import HomePost from "./HomePost";
import HomePostList from "./HomePostList";
import { useHomePostContextAction } from "@/hooks/contetxt/useHomePostContext";
import { GetPostsResponse } from "@/types/ResponseData";

type HomeProps = {
    resGetPosts: GetPostsResponse;
}

export default function Home({ resGetPosts }: HomeProps) {
    const { postStorage, isPostEmpty, updatePostStorage } = useHomePostContextAction();

    return (
        <div>
            <HomePostContext.Provider value={{ postStorage, isPostEmpty, updatePostStorage }}>
                <HomePost/>
                <HomePostList resGetPosts={resGetPosts}/>
            </HomePostContext.Provider>
        </div>
    );
}