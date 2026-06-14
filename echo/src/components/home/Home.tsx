'use client';

import { HomePostContext } from "@/context/HomePostContext";
import HomePost from "./HomePost";
import HomePostList from "./HomePostList";
import { useHomePostContextAction } from "@/hooks/contetxt/useHomePostContext";
import { PostGetResponse } from "@/types/ResponseData";

type HomeProps = {
    response: PostGetResponse;
}

export default function Home({ response }: HomeProps) {
    const { postStorage, isPostEmpty, updatePostStorage } = useHomePostContextAction();

    return (
        <div>
            <HomePostContext.Provider value={{ postStorage, isPostEmpty, updatePostStorage }}>
                <HomePost/>
                <HomePostList response={response}/>
            </HomePostContext.Provider>
        </div>
    );
}