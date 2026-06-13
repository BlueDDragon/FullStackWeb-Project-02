'use client';

import styles from "./Modal.module.css";
import { useCallback } from "react";

type LoginRequiredModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
    if (!isOpen) return null;

    const onClick = useCallback(() => {
        onClose();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.box_modal}>
                <p className={styles.notice}>로그인이 필요합니다.</p>
                <div className={styles.box_btn}>
                    <button className={styles.btn_close} onClick={onClose}>확인</button>
                    <button className={styles.btn_click} onClick={onClick}>로그인</button>
                </div>
            </div>
        </div>
    );
}