'use client';

import mock_homepost from "@/mocks/mock_homepost.json"
import HomePostItem from "./HomePostItem";
import { useContext } from "react";
import { HomePostContext } from "@/context/HomePostContext";

export default function HomePostList() {
    // const temp_homepost = [...mock_homepost.posts];
    const { postStorage, isPostEmpty } = useContext(HomePostContext);

    return (
        <div>
            {!isPostEmpty && 
            postStorage?.posts.sort((a, b) => a.createAt < b.createAt? 1 : -1)
                .map((post) => <HomePostItem key={post.postIdx} post={post}/>)}
        </div>
    );
}