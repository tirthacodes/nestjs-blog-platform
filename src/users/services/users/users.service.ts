import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateUserParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async createUser(userDetails: CreateUserParams) : Promise<User> {
        const newUser = this.userRepository.create(userDetails);

        await this.userRepository.save(newUser);
        return newUser;
        
    }
}
