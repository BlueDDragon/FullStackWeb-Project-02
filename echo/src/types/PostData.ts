export type PostData = {
    postIdx: number;
    rootPostIdx: number;
    parentPostIdx: number;

    userId: string;
    nickname: string;
    content: string;

    state: "POST" | "NOTE" | "DEL" | "ERROR";
    createAt: number;
    deleteAt: number;
}