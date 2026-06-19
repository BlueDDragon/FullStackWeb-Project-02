import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateBookmarkFolderDto {
    @ApiProperty({ example: "예시 북마크" })
    @IsString()
    @Length(1, 20)
    name: string;

    @ApiProperty({ example: "예시 북마크 폴더입니다" })
    @IsString()
    @Length(1, 140)
    description: string;
}
