'use client';

import styles from "./Header.module.css"
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathName = usePathname().split('/');
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);

    return (
        <div className={`${styles.container} ${isHeaderOpen ? styles.open : styles.close}`}>
            <Link className={styles.link_logo} href={`/`}>
                <Image src={`/images/logo_mini.png`} width={30} height={30} alt="logo"/>
                <p>ECHO</p>
            </Link>
            
            <Link className={styles.link_home} href={`/`}>
                <Image src={`/images/icon_home_${pathName[1] === ""? "open" : "close"}.png`} width={30} height={30} alt="home"/>
                <p>홈</p>
            </Link>
            <Link className={styles.link_profile} href={`/profile`}>
                <Image src={`/images/icon_profile_${pathName[1] === "profile"? "open" : "close"}.png`} width={30} height={30} alt="profile"/>
                <p>프로필</p>
            </Link>
            <Link className={styles.link_bookmark} href={`/bookmark`}>
                <Image src={`/images/icon_bookmark_${pathName[1] === "bookmark"? "open" : "close"}.png`} width={30} height={30} alt="bookmark"/>
                <p>북마크</p>
            </Link>
            <Link className={styles.link_chat} href={`/chat`}>
                <Image src={`/images/icon_chat_${pathName[1] === "chat"? "open" : "close"}.png`} width={30} height={30} alt="chat"/>
                <p>채팅</p>
            </Link>
            <Link className={styles.link_setting} href={`/setting`}>
                <Image src={`/images/icon_setting_${pathName[1] === "setting"? "open" : "close"}.png`} width={30} height={30} alt="setting"/>
                <p>설정</p>
            </Link>
            
            {isHeaderOpen ? 
            <button className={styles.btn_collapse} onClick={() => setIsHeaderOpen(false)}>
                <Image src={`/images/icon_arrow_left.png`} width={20} height={20} alt="arrow_left"/>
            </button> : 
            <button className={styles.btn_expand} onClick={() => setIsHeaderOpen(true)}>    
                <Image src={`/images/icon_arrow_right.png`} width={20} height={20} alt="arrow_right"/>
            </button>}

        </div>
    );
}