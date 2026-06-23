import { AuthLoginResponse, AuthMeResponse, } from "@/types/ResponseData";
import { api } from "./fetchServer";
import { getCookie, SetCookie } from "./cookieStore";

export async function fetchAuthRegister() {

}

export async function fetchAuthLogin(userId: string, password: string) : Promise<AuthLoginResponse> {
    const apiURL = new URL(`${process.env.API_URL}/auth/login`);

    const data = await api.post(apiURL, {
        userId: userId,
        password: password,
    });
    if (!data) throw new Error(`response is null`);

    const token = (data as AuthLoginResponse).accessToken;
    await SetCookie('accessToken', token);
    
    return data as AuthLoginResponse;
}

export async function fetchAuthLogout() {
    
}

export async function fetchAuthMe() : Promise<AuthMeResponse> {
    const apiURL = new URL(`${process.env.API_URL}/auth/me`);
    const token = await getCookie('accessToken');

    try {
        const data = await api.get(apiURL, token);
        if (!data) throw new Error();
    
        return data as AuthMeResponse;
    } catch (err) {
        return {
            login: false,
            user: {
                id: "",
                username: "",
                displayName: "",
                profileImageUrl: "",
                headerImageUrl: "",
                createdAt: "",
            }
        }; 
    }

}