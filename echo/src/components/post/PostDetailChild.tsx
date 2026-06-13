'use client';

import styles from "./PostDetail.module.css"
import { useCallback } from "react";
import { PostData } from "@/types/PostData";
import { useRouter } from "next/navigation";

type PostDetailChildProps = {
    post: PostData;
}

export default function PostDetailChild({ post }: PostDetailChildProps) {
    const router = useRouter();

    const handlePostClick = useCallback(() => {
        router.push(`/0/post/${post.id}`);
    }, []);

    return (
        <div className={styles.child_container}>
            <p> </p>
            <div className={styles.container} onClick={handlePostClick}>
                <div className={styles.box_post}>
                    {/* <p className={styles.nickname}>{post.nickname}</p> */}
                    {/* <p className={styles.id}>@{post.userId}</p> */}
                    <p className={styles.nickname}>익명</p>
                    <p className={styles.id}>@___DDragon1231</p>
                    <span> · </span>
                    <p className={styles.createAt}>{post.createdAt}</p>
                </div>
                <button className={styles.btn_del}>...</button>
                <div className={styles.box_content}>
                    <p className={styles.content}>{post.content}</p>
                </div>
                <div className={styles.box_bottom}>
                    <button className={styles.comment}>💬 <span>0</span></button>
                    <button className={styles.like}>❤️ <span>0</span></button>
                    <button className={styles.bookmark}>🔖 <span>0</span></button>
                </div>
            </div>
        </div>
    );
}