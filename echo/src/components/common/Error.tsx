'use client';

import { useRouter } from "next/navigation";
import styles from "./Error.module.css"
import { useCallback } from "react";

type ErrorProps = {
    info: string;
}

export default function ErrorPage({ info }: ErrorProps) {
    const router = useRouter();

    const onReload = useCallback(() => {
        // router.refresh();
        window.location.reload();
    }, []);

    return (
        <div className={styles.container}>
            <p className={styles.error}>!</p>
            <p className={styles.info}>{info}</p>
            <button className={styles.btn} onClick={onReload}>새로고침</button>
        </div>
    );
}