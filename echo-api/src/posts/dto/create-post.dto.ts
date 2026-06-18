import { ApiProperty } from "@nestjs/swagger";
import { PostState } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsOptional()
    rootPostId: number;
    
    @ApiProperty({ example: 2 })
    @IsInt()
    @IsOptional()
    parentPostId: number;

    @ApiProperty({ example: PostState.PUBLIC })
    @IsEnum(PostState)
    state: PostState;

    @ApiProperty({ example: "이 글은 공개글입니다" })
    @IsString()
    @Length(1, 140)
    content: string;

    @ApiProperty({ example: "example00" })
    @IsString()
    authorId: string;
}
