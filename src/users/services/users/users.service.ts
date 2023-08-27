import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateUserParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
        const salt = await bcrypt.genSalt();
        const hashedPassword = await this.hashPassword(userDetails.password, salt);

        const newUser = this.userRepository.create({...userDetails, salt, password: hashedPassword,});

        await this.userRepository.save(newUser);
        return newUser;
        
    }

    private async hashPassword(password: string, salt: string) : Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
