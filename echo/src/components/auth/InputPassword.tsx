import styles from "../modal/Modal.module.css"
import { ChangeEvent, KeyboardEvent, Ref } from "react";
import Image from "next/image";

type InputPasswordProps = {
    placeholder: string;
    
    isHiddenPassword: boolean;
    inputPasswordRef?: Ref<HTMLInputElement>;
    handleChangeUserPassword: (e: ChangeEvent<HTMLInputElement>) => void;
    handleLoginKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleToggleIsHiddenPassword: () => void;
}

export default function InputPassword({ placeholder, isHiddenPassword, inputPasswordRef, handleChangeUserPassword, handleLoginKeyDown, handleToggleIsHiddenPassword }: InputPasswordProps) {
    return (
        <div className={styles.password_box}>
            <input className={styles.input_password} type={isHiddenPassword ? "password" : "text"} ref={inputPasswordRef} placeholder={placeholder} onChange={handleChangeUserPassword} onKeyDown={handleLoginKeyDown}/>
            {isHiddenPassword && <Image className={styles.img_password} src={(`/images/input_password_hidden.png`)} width={50} height={50} alt="" onClick={handleToggleIsHiddenPassword}/>}
            {!isHiddenPassword && <Image className={styles.img_password} src={(`/images/input_password_show.png`)} width={50} height={50} alt="" onClick={handleToggleIsHiddenPassword}/>}
        </div>
    );
}