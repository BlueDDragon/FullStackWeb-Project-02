'use client';

import LoginRequiredModal from "@/components/modal/LoginRequiredModal";
import { PostStorage } from "@/types/StorageData";
import { createContext, useCallback, useState } from "react";

type ModalContextType = {
    openLoginModal: () => void;
};

export const ModalContext = createContext<ModalContextType>( {
    openLoginModal: () => {},
});

export default function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpenLogin, setIsOpenLogin] = useState(false);

    const openLoginModal = useCallback(() => {
        setIsOpenLogin(true);
    }, []);

    return (
        <ModalContext.Provider value={{ openLoginModal }}>
            {children}

            <LoginRequiredModal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}/>
        </ModalContext.Provider>
    );
}