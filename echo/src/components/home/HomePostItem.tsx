import styles from "./HomePostItem.module.css"
import { PostData } from "@/types/PostData";

type HomePostItemProps = {
    post: PostData;
}

export default function HomePostItem({ post }: HomePostItemProps) {
    return (
        <div className={styles.container}>
            <div className={styles.box_post}>
                <p className={styles.nickname}>{post.nickname}</p>
                <p className={styles.id}>@{post.id}</p>
                <span> · </span>
                <p className={styles.createAt}>{post.createAt}</p>
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
    );
}