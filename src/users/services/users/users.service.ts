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
            if (!cookie) {
                throw new UnauthorizedException('JWT token not provided in the cookie.');
              }
          
            const data = await this.jwtService.verifyAsync(cookie);

            if(!data){
                throw new UnauthorizedException('Invalid or expired JWT token.');
            }

            return this.userRepository.find();
        }catch(e){
            throw new UnauthorizedException('Authentication error occurred.');
        } 
    }

    async createUser(userDetails: CreateUserParams)  {

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
                throw new InternalServerErrorException('Registration failed. Please try again later.');
            }
        }        
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }

    private async validateUserPassword(userDetails: SignInUserParams){
        const user = await this.userRepository.findOne({ where: {username: userDetails.username}});

        if(user && await user.validatePassword(userDetails.password)){
            return user;
        }
        else{
            return null;
        }
        
    }

    private setTokenCookie(response: Response, accessToken: string): void {
        response.cookie('jwt', accessToken, {httpOnly: true, maxAge: 3600000});
    }

    async signInUser(userDetails: SignInUserParams, response: Response) : Promise<{message}> {

        const user = await this.validateUserPassword({...userDetails});

        if(!user){
            throw new BadRequestException('Invalid username or password!');
        }

        const payload = {sub: user.id, username: user.username};
        const accessToken = await this.jwtService.signAsync(payload);

        this.setTokenCookie(response,accessToken);

        return {
            message: 'Login Successful!'
        };    
    }

    async signOutUser(token: string, response: Response) : Promise<any> {

        if(!token){
            throw new BadRequestException('No JWT token found in cookies.');
        }

        response.clearCookie('jwt');

        return{
            message: 'Logout Successfully!'
        };
    }

}
