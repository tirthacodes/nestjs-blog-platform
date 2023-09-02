import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Blog } from 'src/blogs/blog.entity';
import { CreateBlogParams } from 'src/blogs/blog.types';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
        private jwtService: JwtService
    ){}

    private getUserIdfromToken(token: string){
        try{
            const data = this.jwtService.verify(token);
            return data.sub;
        }
        catch(error){
            throw new UnauthorizedException('Invalid Token');
        }
    }

    async createBlog(token: string,userDetails: CreateBlogParams){
        const userId = this.getUserIdfromToken(token)

        const newBlog = this.blogRepository.create({
            title: userDetails.title,
            content: userDetails.content,
            user: userId,
        });

        try{
            const savedBlog = this.blogRepository.save(newBlog);
            return savedBlog;
            // return{
            //     message: "blog created success!"
            // }
        }
        catch(e){
            return new InternalServerErrorException('Failed to create new blog');
        }
    }
}
