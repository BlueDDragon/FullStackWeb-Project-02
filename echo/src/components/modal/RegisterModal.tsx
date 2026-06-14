'use client';

import { ModalContext } from "@/context/ModalContext";
import styles from "./Modal.module.css";
import { useCallback, useContext } from "react";

type RegisterModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
    if (!isOpen) return null;

    const { openLoginModal } = useContext(ModalContext);

    const onRegisterClick = useCallback(() => {
        onClose();
    }, []);
    
    const onLoginClick = useCallback(() => {
        onClose();
        openLoginModal();
    }, []);
    

    return (
        <div className={styles.container}>
            <div className={styles.box_modal}>
                <p className={styles.notice}>새로운 회원은 언제나 환영이야.</p>
                <button className={styles.btn_close} onClick={onClose}>×</button>
                <div className={styles.box_btn_vertical}>
                    <input className={styles.input_id} type="text" placeholder="아이디"/>
                    <input className={styles.input_password} type="password" placeholder="비밀번호"/>
                    <input className={styles.input_password} type="password" placeholder="비밀번호 재입력"/>
                    <input className={styles.input_id} type="text" placeholder="닉네임"/>
                    <div/>
                    <button className={styles.btn_yes} onClick={onRegisterClick}>회원가입</button>
                    <button className={styles.btn_link} onClick={onLoginClick}>로그인</button>
                </div>
            </div>
        </div>
    );
}