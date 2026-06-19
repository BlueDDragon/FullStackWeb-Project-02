import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PostState } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";

export class CreatePostDto {
    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    rootPostId: number;
    
    @ApiPropertyOptional({ example: 2 })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    parentPostId: number;

    @ApiProperty({ example: PostState.PUBLIC })
    @IsEnum(PostState)
    state: PostState;

    @ApiProperty({ example: "이 글은 공개글입니다" })
    @IsString()
    @Length(1, 140)
    content: string;

    // @ApiProperty({ example: "example00" })
    // @IsString()
    // authorId: string;
}

export class CreatePostWithImagesDto extends CreatePostDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
    })
    images: any[];
}