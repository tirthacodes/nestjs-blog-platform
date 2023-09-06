import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content: string;
}