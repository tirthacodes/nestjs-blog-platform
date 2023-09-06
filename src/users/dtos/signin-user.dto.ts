import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger/dist/decorators";

export class SigninUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}