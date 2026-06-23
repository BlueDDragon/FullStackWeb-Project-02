'use client';

import { HomePostContext } from "@/context/HomePostContext";
import HomePost from "./HomePost";
import HomePostList from "./HomePostList";
import { useHomePostContextAction } from "@/hooks/contetxt/useHomePostContext";
import { AuthMeResponse, GetPostsResponse } from "@/types/ResponseData";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

type HomeProps = {
    resAuthMe: AuthMeResponse;
    resGetPosts: GetPostsResponse;
}

export default function Home({ resAuthMe, resGetPosts }: HomeProps) {
    const { setAuthData } = useContext(AuthContext);
    const { postStorage, isPostEmpty, updatePostStorage } = useHomePostContextAction();

    useEffect(() => {
        setAuthData(resAuthMe);
    }, [resAuthMe]);

    return (
        <div>
            <HomePostContext.Provider value={{ postStorage, isPostEmpty, updatePostStorage }}>
                <HomePost/>
                <HomePostList resGetPosts={resGetPosts}/>
            </HomePostContext.Provider>
        </div>
    );
}