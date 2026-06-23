'use client';

import { ModalContext } from "@/context/ModalContext";
import styles from "../modal/Modal.module.css"
import { useCallback, useContext } from "react";

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    if (!isOpen) return null;

    const { openRegisterModal } = useContext(ModalContext);

    const onLoginClick = useCallback(() => {
        onClose();
    }, []);
    
    const onRegisterClick = useCallback(() => {
        onClose();
        openRegisterModal();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.box_modal}>
                <p className={styles.notice}>로그인이 필요합니다.</p>
                <button className={styles.btn_close} onClick={onClose}>×</button>
                <div className={styles.box_btn_vertical}>
                    <input className={styles.input_id} type="text" placeholder="아이디"/>
                    <input className={styles.input_password} type="password" placeholder="비밀번호"/>
                    <div/>
                    <button className={styles.btn_yes} onClick={onLoginClick}>로그인</button>
                    <button className={styles.btn_link} onClick={onRegisterClick}>회원가입</button>
                </div>
            </div>
        </div>
    );
}