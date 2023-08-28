import { Controller, Get, Post, Body } from '@nestjs/common';
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
    signInUser(@Body() signInDto: SigninUserDto) : Promise<{accessToken: string}> {
        return this.userService.signInUser(signInDto);
    }
}
