export interface AuthData {
    login: boolean;
    user: UserData;
}

export interface UserData {
    id: string;
    username: string;
    displayName: string;
    profileImageUrl: string;
    createdAt: string;
}