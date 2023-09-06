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

    /**
     * Get all users.
     * @param request -The HTTP request object.
     * @returns A list of user objects.
     */
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

    /**
     * Create a new user.
     * @param userDetails - The user details for registration.
     * @returns A success message or an error
     */
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

    /**
     * ign in a user with the provided credentials and issue a JWT token upon successful authentication.
     * @param userDetails - The user's sign-in credentials.
     * @param response - The HTTP response object. 
     * @returns An object containing a success message.
     * @throws BadRequestException if the provided credentials are invalid.
     */
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

    /**
     * Sign out a user by clearing the JWT token.
     * @param token - The JWT token.
     * @param response The HTTP response object.
     * @returns A success message.
     */
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
