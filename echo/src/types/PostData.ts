export type PostData = {
    index: number;
    originIndex: number;

    userId: string;
    nickname: string;
    content: string;

    state: "POST" | "NOTE" | "DEL" | "ERROR";
    createAt: string;
    deleteAt: string;
}