export type PostData = {
    index: number;
    id: string;
    nickname: string;
    content: string;

    state: "POST" | "DEL" | "ERROR";
    createAt: string;
    amendAt: string;
    deleteAt: string;
}