import styles from "./HomePost.module.css"

export default function HomePost() {
    return (
        <div className={styles.container}>
            <p className={styles.subtitle}>글쓰기</p>
            <div className={styles.box_input}>
                <textarea maxLength={140} placeholder="무슨 일이 일어나고 있나요?"/>
                <p>0/140</p>
            </div>
            <div className={styles.box_btn}>
                <div className={styles.etc_box}>
                    <button className={styles.btn_pic}>사진</button>
                    <button className={styles.btn_emoji}>이모지</button>
                    <button className={styles.btn_vote}>투표</button>
                </div>
                <button className={styles.btn_submit}>등록</button>
            </div>
        </div>
    );
}