import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SigninUserDto } from 'src/users/dtos/signin-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Returns a list of users', type: [User] })
    findAllUsers(@Req() request: Request): Promise<User[]> {
        return this.userService.findAllUsers(request);
    }

    @Post('register')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    createUser(@Body() createUserDto: CreateUserDto)  {
        return this.userService.createUser(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Sign in user' })
    @ApiResponse({ status: 200, description: 'Sign in successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async signInUser(@Body() signInDto: SigninUserDto,
    @Res({ passthrough: true}) response: Response) : Promise<{message: any}> {
        const result =  await this.userService.signInUser(signInDto, response);
        return result;
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    logout(@Res({passthrough:true}) response: Response, @Req() request: Request) : Promise<any> {
        const token = request.cookies.jwt;
        return this.userService.signOutUser(token, response);
        
    }
}
