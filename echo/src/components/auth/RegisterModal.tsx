'use client';

import { ModalContext } from "@/context/ModalContext";
import styles from "../modal/Modal.module.css"
import { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import InputPassword from "./InputPassword";

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
                <p className={styles.notice}>회원가입을 해주세요.</p>
                <button className={styles.btn_close} onClick={onClose}>×</button>
                <div className={styles.box_btn_vertical}>
                    <input className={styles.input_id} type="text" placeholder="아이디"/>
                    <input className={styles.input_id} type="email" placeholder="이메일"/>
                    <InputPassword placeholder="비밀번호"/>
                    <InputPassword placeholder="비밀번호 재입력"/>
                    <input className={styles.input_id} type="text" placeholder="닉네임"/>
                    <div/>
                    <button className={styles.btn_yes} onClick={onRegisterClick}>회원가입</button>
                    <button className={styles.btn_link} onClick={onLoginClick}>로그인</button>
                </div>
            </div>
        </div>
    );
}