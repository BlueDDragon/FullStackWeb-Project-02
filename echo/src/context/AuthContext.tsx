'use client';

import { AuthData } from "@/types/AuthData";
import { AuthMeResponse } from "@/types/ResponseData";
import { createContext, useState } from "react";

type AuthContextType = {
    auth: AuthData | undefined;
    setAuthData: (res: AuthMeResponse) => void;
};

export const AuthContext = createContext<AuthContextType>( {
    auth: undefined,
    setAuthData: (res: AuthMeResponse) => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthData | undefined>();

    const setAuthData = (res: AuthMeResponse) => {
        if (!res) return;
        
        setAuth({
            login: res.login,
            userId: res.user.userId,
            username: res.user.username,
            profileImageUrl: res.user.profileImageUrl,
            createdAt: res.user.createdAt,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
}