'use client';

import { HomePostContext } from "@/context/HomePostContext";
import HomePost from "./HomePost";
import HomePostList from "./HomePostList";
import { useHomePostContextAction } from "@/hooks/contetxt/useHomePostContext";
import { AuthMeResponse, PostFindAllResponse } from "@/types/ResponseData";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

type HomeProps = {
    resAuthMe: AuthMeResponse;
    resPostFindAll: PostFindAllResponse;
}

export default function Home({ resAuthMe, resPostFindAll }: HomeProps) {
    const { setAuthData } = useContext(AuthContext);
    const { postStorage, isPostEmpty, updatePostStorage } = useHomePostContextAction();

    useEffect(() => {
        setAuthData(resAuthMe);
    }, [resAuthMe]);

    return (
        <div>
            <HomePostContext.Provider value={{ postStorage, isPostEmpty, updatePostStorage }}>
                <HomePost/>
                <HomePostList resPostFindAll={resPostFindAll}/>
            </HomePostContext.Provider>
        </div>
    );
}