import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

    async test(request: Request){
        const cookie = request.cookies.jwt;
        const data = await this.jwtService.verifyAsync(cookie);

        const userId = data.sub;
        return userId;
    }

    async createBlog(request: Request,userDetails: CreateBlogParams){
        const cookie = request.cookies.jwt;
        const data = await this.jwtService.verifyAsync(cookie);

        
        return data.sub;

        // const newUser = this.blogRepository.create({...userDetails});

        // try{
        //     this.blogRepository.save(newUser);
        //     return{
        //         message: "blog created success!"
        //     }
        // }
        // catch(e){
        //     return new InternalServerErrorException();
        // }
    }
}
