import styles from "./Profile.module.css"
import Image from "next/image";

export default function Profile() {
    return (
        <div className={styles.container}>
            <div className={styles.box_header}>
                <button className={styles.btn_back}>←</button>
                <div className={styles.box_header_text}>
                    <p className={styles.user_name}>{`사용자 닉네임`}</p>
                    <p className={styles.post_count}>{(1615).toLocaleString()} 게시물</p>
                </div>
                <button className={styles.btn_search}>검색</button>
            </div>
            <div className={styles.box_banner}></div>
            <div className={styles.box_info}>
                <Image src={`/images/profile.png`} width={100} height={100} alt=""/>
                <button className={styles.btn_update}>프로필 수정</button>
                <div className={styles.box_info_user}>
                    <p className={styles.user_name}>{`사용자 닉네임`}</p>
                    <p className={styles.user_id}>@{`사용자 아이디`}</p>
                    <p className={styles.user_description}>{`사용자 프로필 설정`}</p>
                    <p className={styles.user_createdat}>{`가입일: 2020년 10월`}</p>
                </div>
                <div className={styles.box_info_follow}>
                    <p className={styles.follow}><b>{24}</b>팔로우</p>
                    <p className={styles.follower}><b>{19}</b>팔로워</p>
                </div>
            </div>
            <div className={styles.box_content}>
                <p className={styles.post}>게시물</p>
                <div className={styles.box_post}>
                </div>
            </div>
        </div>
    );
}