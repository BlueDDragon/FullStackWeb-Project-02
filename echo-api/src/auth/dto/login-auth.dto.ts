import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({ example: "example00" })
    @IsString()
    username: string;

    @ApiProperty({ example: "00000000" })
    @IsString()
    @MinLength(8)
    password: string;
}
