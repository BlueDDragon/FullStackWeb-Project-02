export const api = {
    get: <T>(url: string) =>
        fetchData<T>(url),

    post: <T>(url: string, body: unknown) =>
        fetchData<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    patch: <T>(url: string, body: unknown) =>
        fetchData<T>(url, {
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: <T>(url: string) =>
        fetchData<T>(url, {
            method: "DELETE",
        }),
};

export async function fetchData<T>(url: string, options?: RequestInit) : Promise<T | undefined> {
    console.log(`fetch: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error();

        const data = await response.json();
        if (!data || data === null || data === undefined) throw new Error();

        return data;
    }
    catch (error) {
        console.log(error);
        return undefined;
    }
}