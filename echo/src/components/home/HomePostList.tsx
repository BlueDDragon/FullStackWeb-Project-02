'use client';

import mock_homepost from "@/mocks/mock_homepost.json"
import { useContext } from "react";
import { HomePostContext } from "@/context/HomePostContext";
import { PostFindAllResponse } from "@/types/ResponseData";
import PostDetail from "../post/PostDetail";

type HomePostProps = {
    response: PostFindAllResponse;
}

export default function HomePostList({ response }: HomePostProps) {
    // const temp_homepost = [...mock_homepost.posts];
    // const { postStorage, isPostEmpty } = useContext(HomePostContext);

    const isPostEmpty = !(response?.posts.length > 0);

    return (
        <div>
            {!isPostEmpty && 
            response?.posts.sort((a, b) => a.createdAt < b.createdAt? 1 : -1)
                .map((post) => <PostDetail key={post.id} post={post} isFocus={true}/>)}
        </div>
    );
}