import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";

export enum PostState {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    NOTICE = "NOTICE",
    DELETED = "DELETED",
    ERROR = "ERROR",
}

export class CreatePostDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    rootPostId: number = -1;

    @ApiProperty({ example: 2 })
    @IsInt()
    parentPostId: number = -1;

    @ApiProperty({ example: PostState.PUBLIC, description: "PUBLIC, PRIVATE, NOTICE, DELETED, ERROR" })
    @IsEnum(PostState)
    state: PostState;

    @ApiProperty({ example: "이 글은 공개글입니다" })
    @IsString()
    @Length(1, 140)
    content: string;

    @ApiProperty({ example: 0 })
    @IsInt()
    @IsOptional()
    like: number = 0;

    @ApiProperty({ example: 0 })
    @IsInt()
    @IsOptional()
    bookmark: number = 0;

    @ApiProperty({ example: "example00", description: "사용자 Id" })
    @IsString()
    userId: string;
}