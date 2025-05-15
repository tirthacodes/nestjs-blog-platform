import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string;
}