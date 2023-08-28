import { IsNotEmpty, IsEmail, MinLength, IsString } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}