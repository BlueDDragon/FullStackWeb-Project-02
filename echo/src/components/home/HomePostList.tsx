'use client';

import mock_homepost from "@/mocks/mock_homepost.json"
import { useContext } from "react";
import { HomePostContext } from "@/context/HomePostContext";
import { GetPostsResponse } from "@/types/ResponseData";
import PostDetail from "../post/PostDetail";

type HomePostProps = {
    resGetPosts: GetPostsResponse;
}

export default function HomePostList({ resGetPosts }: HomePostProps) {
    // const temp_homepost = [...mock_homepost.posts];
    // const { postStorage, isPostEmpty } = useContext(HomePostContext);

    const isPostEmpty = !(resGetPosts?.posts.length > 0);

    return (
        <div>
            {!isPostEmpty && 
            resGetPosts?.posts.map((post) => <PostDetail key={post.id} post={post} isFocus={true}/>)}
        </div>
    );
}