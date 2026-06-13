import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";

export enum PostState {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    NOTICE = "NOTICE",
    DELETED = "DELETED",
    ERROR = "ERROR",
}

export class CreatePostDto {
    @IsInt()
    rootPostId: number = -1;

    @IsInt()
    parentPostId: number = -1;

    @IsEnum(PostState)
    state: PostState;

    @IsString()
    @Length(1, 140)
    content: string;

    @IsInt()
    @IsOptional()
    like: number = 0;

    @IsInt()
    @IsOptional()
    bookmarks: number = 0;

    @IsString()
    userId: string;
}