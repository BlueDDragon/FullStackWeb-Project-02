'use client';

import mock_homepost from "@/mocks/mock_homepost.json"
import HomePostItem from "./HomePostItem";
import { getPostData } from "@/utils/service/postDataUtils";
import { useEffect, useState } from "react";
import { PostStorage } from "@/types/StorageData";

export default function HomePostList() {
    // const temp_homepost = [...mock_homepost.posts];

    const [post, setPost] = useState<PostStorage>();
    const isPostEmpty = (!post || !Array.isArray(post.posts) || post.posts.length <= 0);
    useEffect(() => {
        setPost(getPostData());
    }, []);

    return (
        <div>
            {!isPostEmpty && post?.posts.map((post) => <HomePostItem key={post.index} post={post}/>)}
        </div>
    );
}