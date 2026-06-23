'use client';

import { AuthData } from "@/types/AuthData";
import { AuthMeResponse } from "@/types/ResponseData";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    auth: AuthData | undefined;
};

export const AuthContext = createContext<AuthContextType>( {
    auth: undefined
});

export default function AuthProvider({ children, resAuthMe }: { children: React.ReactNode, resAuthMe: AuthMeResponse }) {
    return (
        <AuthContext.Provider value={{ auth: resAuthMe }}>
            {children}
        </AuthContext.Provider>
    );
}