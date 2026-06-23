'use client';

import styles from "./Header.module.css"
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { ModalContext } from "@/context/ModalContext";

export default function Header() {
    const router = useRouter();

    const pathName = usePathname().split('/');
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);

    const isLinkHome = pathName[1] === "";
    const isLinkProfile = pathName[2] === "profile";
    const isLinkBookmark = pathName[2] === "bookmark";
    const isLinkChat = pathName[2] === "chat";
    const isLinkSetting = pathName[1] === "setting";

    const { auth } = useContext(AuthContext);
    const username = auth?.login ? auth.user.username : "0";

    const { openLoginModal } = useContext(ModalContext);
    const onClickLink = (href: string) => {
        if (!auth?.login)
            openLoginModal();
        else
            router.push(href);
    }

    return (
        <div className={`${styles.container} ${isHeaderOpen ? styles.open : styles.close}`}>
            <Link className={styles.link_logo} href={`/`}>
                <Image src={`/images/logo_mini.png`} width={30} height={30} alt="logo"/>
                <p>ECHO</p>
            </Link>
            
            <Link className={styles.link_home} href={`/`}>
                <Image src={`/images/icon_home_${isLinkHome? "open" : "close"}.png`} width={30} height={30} alt="home"/>
                <p>홈</p>
            </Link>
            <button className={styles.link_profile} onClick={() => onClickLink(`/${username}/profile`)}>
                <Image src={`/images/icon_profile_${isLinkProfile? "open" : "close"}.png`} width={30} height={30} alt="profile"/>
                <p>프로필</p>
            </button>
            <button className={styles.link_bookmark} onClick={() => onClickLink(`/${username}/bookmark`)}>
                <Image src={`/images/icon_bookmark_${isLinkBookmark? "open" : "close"}.png`} width={30} height={30} alt="bookmark"/>
                <p>북마크</p>
            </button>
            <button className={styles.link_chat} onClick={() => onClickLink(`/${username}/chat`)}>
                <Image src={`/images/icon_chat_${isLinkChat? "open" : "close"}.png`} width={30} height={30} alt="chat"/>
                <p>채팅</p>
            </button>
            <button className={styles.link_setting} onClick={() => onClickLink(`/setting`)}>
                <Image src={`/images/icon_setting_${isLinkSetting? "open" : "close"}.png`} width={30} height={30} alt="setting"/>
                <p>설정</p>
            </button>
            
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