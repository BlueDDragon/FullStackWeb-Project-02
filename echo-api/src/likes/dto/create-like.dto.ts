import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateLikeDto {
    @ApiProperty({ example: "febaedcb-0c90-4ae6-a204-11bf8b3e91ee" })
    @IsString()
    userId: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    postId: number;
}
