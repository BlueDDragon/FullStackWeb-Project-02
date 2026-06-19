import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateBookmarkDto {
    @ApiProperty({ example: "" })
    @IsString()
    folderId: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    postId: number;
}
