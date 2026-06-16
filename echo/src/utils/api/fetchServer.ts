export const api = {
    get: <T>(url: URL) =>
        fetchData<T>(url),

    post: <T>(url: URL, body: any) =>
        fetchData<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    patch: <T>(url: URL, body: any) =>
        fetchData<T>(url, {
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: <T>(url: URL) =>
        fetchData<T>(url, {
            method: "DELETE",
        }),
};

export async function fetchData<T>(url: URL, options?: RequestInit) : Promise<T | undefined> {
    console.log(`fetch: ${url}`);

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        if (!data || data === null || data === undefined) throw new Error(`Response data is empty`);

        return data;
    }
    catch (error) {
        console.log(error);
        return undefined;
    }
}