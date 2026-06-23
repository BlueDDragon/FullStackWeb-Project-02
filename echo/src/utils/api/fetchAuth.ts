import { AuthLoginResponse, AuthMeResponse, } from "@/types/ResponseData";
import { api } from "./fetchServer";

export async function fetchAuthRegister() {

}

export async function fetchAuthLogin(userId: string, password: string) : Promise<AuthLoginResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);

    const data = await api.post(apiURL, {
        userId: userId,
        password: password,
    });
    if (!data) throw new Error(`response is null`);

    const token = (data as AuthLoginResponse).accessToken;
    localStorage.setItem('accessToken', token);
    
    return data as AuthLoginResponse;
}

export async function fetchAuthLogout() {
    
}

export async function fetchAuthMe(token: string) : Promise<AuthMeResponse> {
    const apiURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);

    try {
        const data = await api.get(apiURL, token);
        if (!data) throw new Error();
    
        return data as AuthMeResponse;
    } catch (err) {
        return {
            login: false,
            user: {
                userId: "",
                username: "",
                profileImageUrl: "",
                createdAt: "",
            }
        }; 
    }
}