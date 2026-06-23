'use client';

import LoginRequiredModal from "@/components/modal/LoginRequiredModal";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { createContext, useCallback, useState } from "react";

type ModalContextType = {
    openRegisterModal: () => void;
    openLoginModal: () => void;
    openLoginRequiredModal: () => void;
};

export const ModalContext = createContext<ModalContextType>( {
    openRegisterModal: () => {},
    openLoginModal: () => {},
    openLoginRequiredModal: ()=> {},
});

export default function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpenRegister, setIsOpenRegister] = useState(false);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenLoginRequired, setIsOpenLoginRequired] = useState(false);

    const openRegisterModal = useCallback(() => {
        setIsOpenRegister(true);
    }, []);

    const openLoginModal = useCallback(() => {
        setIsOpenLogin(true);
    }, []);

    const openLoginRequiredModal = useCallback(() => {
        setIsOpenLoginRequired(true);
    }, []);

    return (
        <ModalContext.Provider value={{ openRegisterModal, openLoginModal, openLoginRequiredModal }}>
            {children}

            <RegisterModal isOpen={isOpenRegister} onClose={() => setIsOpenRegister(false)}/>
            <LoginModal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}/>
            <LoginRequiredModal isOpen={isOpenLoginRequired} onClose={() => setIsOpenLoginRequired(false)}/>
        </ModalContext.Provider>
    );
}