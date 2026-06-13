import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(1, 20)
    id: string;

    @IsString()
    @Length(1, 20)
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    profileImageUrl: string;
}
