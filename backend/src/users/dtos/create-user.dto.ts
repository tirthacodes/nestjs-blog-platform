import { IsNotEmpty, IsEmail, MinLength, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}