import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
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
    findAllUsers(@Req() request: Request): Promise<User[]> {
        return this.userService.findAllUsers(request);
    }

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto)  {
        return this.userService.createUser(createUserDto);
    }

    @Post('login')
    async signInUser(@Body() signInDto: SigninUserDto,
    @Res({ passthrough: true}) response: Response) : Promise<{message: any}> {
        const result =  await this.userService.signInUser(signInDto, response);
        return result;
    }

    @Post('logout')
    logout(@Res({passthrough:true}) response: Response, @Req() request: Request) : Promise<any> {
        const token = request.cookies.jwt;
        return this.userService.signOutUser(token, response);
        
    }
}
