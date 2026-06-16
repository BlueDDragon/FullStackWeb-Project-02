export const api = {
    get: <T>(url: URL, token: string = "") =>
        fetchData<T>(url, token),

    post: <T>(url: URL, body: any, token: string = "") =>
        fetchData<T>(url, token, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    patch: <T>(url: URL, body: any, token: string = "") =>
        fetchData<T>(url, token, {
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: <T>(url: URL, token: string = "") =>
        fetchData<T>(url, token, {
            method: "DELETE",
        }),
};

export async function fetchData<T>(url: URL, token: string, options?: RequestInit) : Promise<T | undefined> {
    console.log(`fetch: ${options?.method ?? "GET"}: ${url}`);

    try {
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOWI1YTI1My00MmM3LTQ3ZDQtOTM0Ny1lMjYzZmRkZWU5OGUiLCJ1c2VySWQiOiJleGFtcGxlMDAiLCJ1c2VybmFtZSI6Iuq0gOumrOyekCIsImlhdCI6MTc4MTYxNzM1NCwiZXhwIjoxNzgxNjIwOTU0fQ.QtcGM7mwEgRnuEQGbQdaB5-zZs3j6KRuKOEwkJ2I3SM";
        //localStorage.getItem("accessToken");
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token 
                    ? { Authorization: `Bearer ${token}` }
                    : {}),
                ...options?.headers,
            },
        });
        // if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        if (!response.ok) return undefined;

        const data = await response.json();
        if (!data || data === null || data === undefined) throw new Error(`Response data is empty`);

        return data;
    }
    catch (error) {
        console.error("fetchData error:", error);
        return undefined;
    }
}