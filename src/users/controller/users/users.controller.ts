import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SigninUserDto } from 'src/users/dtos/signin-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Get()
    findAllUsers(): Promise<User[]> {
        return this.userService.findAllUsers();
    }

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto)  {
        return this.userService.createUser(createUserDto);
    }

    @Post('login')
    async signInUser(@Body() signInDto: SigninUserDto,
    @Res({ passthrough: true}) response: Response) : Promise<{message}> {
        const result =  await this.userService.signInUser(signInDto, response);
        return result;
    }
}
