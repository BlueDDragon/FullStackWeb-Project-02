import { cookies } from "next/headers";

export async function getCookie(key: string) : Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value ?? "";
}

export async function SetCookie(key: string, data: string) {
    const cookieStore = await cookies();
    cookieStore.set(key, data, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}