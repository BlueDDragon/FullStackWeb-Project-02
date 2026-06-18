import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";

export class RegisterAuthDto {
    @ApiProperty({ example: "example00" })
    @IsString()
    @Length(1, 20)
    username: string;

    @ApiProperty({ example: "예시" })
    @IsString()
    @Length(1, 20)
    displayName: string;

    @ApiProperty({ example: "example00@a.com" })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "00000000" })
    @IsString()
    @MinLength(8)
    password: string;
}
