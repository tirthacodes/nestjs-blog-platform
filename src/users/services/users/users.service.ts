import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateUserParams, SignInUserParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        private jwtService: JwtService,
    ){}

    async findAllUsers(request: Request): Promise<User[]> {
        try{
            const cookie = request.cookies['jwt'];
    
            const data = await this.jwtService.verifyAsync(cookie);

            if(!data){
                throw new UnauthorizedException();
            }

            return this.userRepository.find();
        }catch(e){
            throw new UnauthorizedException();
        }

        
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

    private setTokenCookie(response: Response, accessToken: string): void {
        response.cookie('jwt', accessToken, {httpOnly: true, maxAge: 3600000});
    }

    async signInUser(userDetails: SignInUserParams, response: Response) : Promise<{message}> {

        const username = await this.validateUserPassword({...userDetails});

        if(!username){
            throw new BadRequestException('Invalid credentials');
        }

        const payload = {username};
        const accessToken = await this.jwtService.signAsync(payload);

        this.setTokenCookie(response,accessToken);

        return {
            message: 'success!'
        }; 
        
    }
}
