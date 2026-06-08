'use client';

import { HomePostContext } from "@/context/HomePostContext";
import HomePost from "./HomePost";
import HomePostList from "./HomePostList";
import { useHomePostContextAction } from "@/hooks/contetxt/useHomePostContext";

export default function Home() {
    const { postStorage, isPostEmpty, updatePostStorage } = useHomePostContextAction();

    return (
        <div>
            <h1>Echo</h1>
            <HomePostContext.Provider value={{ postStorage, isPostEmpty, updatePostStorage }}>
                <HomePost/>
                <HomePostList/>
            </HomePostContext.Provider>
        </div>
    );
}