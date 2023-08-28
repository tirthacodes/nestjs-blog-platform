import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateUserParams, SignInUserParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async createUser(userDetails: CreateUserParams)  {
        // const existingUser = await this.userRepository.findOne({where: {username: userDetails.username}});

        // if(existingUser){
        //     return('Username is already taken!');
        // }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await this.hashPassword(userDetails.password, salt);

        const newUser = this.userRepository.create({...userDetails, salt, password: hashedPassword,});
        
        
        try{
            await this.userRepository.save(newUser);
            return {message: 'registration successful!'};
        }
        catch(error){
            if(error.code === 'ER_DUP_ENTRY'){
                throw new ConflictException('Username already exists!');
            }
            else{
                throw new InternalServerErrorException();
            }
        }
                
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }

    private async validateUserPassword(userDetails: SignInUserParams){
        const user = await this.userRepository.findOne({ where: {username: userDetails.username}});

        if(user && await user.validatePassword(userDetails.password)){
            return user.username;
        }
        else{
            return null;
        }
        
    }

    async signInUser(userDetails: SignInUserParams){

        const username = await this.validateUserPassword({...userDetails});

        if(!username){
            throw new BadRequestException('Invalid credentials');
        }
        
    }
}
