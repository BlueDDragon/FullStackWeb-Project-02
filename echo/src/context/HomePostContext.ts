import { PostStorage } from "@/types/StorageData";
import { createContext } from "react";

type HomePostContextType = {
    postStorage: PostStorage | undefined;
    isPostEmpty: boolean;
    updatePostStorage: () => void;
};

export const HomePostContext = createContext<HomePostContextType>( {
    postStorage: undefined,
    isPostEmpty: false,
    updatePostStorage: () => {},
});