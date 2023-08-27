import { Controller, Get } from '@nestjs/common';
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
}
