import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Blog } from 'src/blogs/blog.entity';
import { CreateBlogParams } from 'src/blogs/blog.types';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>
    ){}

    async createBlog(request: Request,userDetails: CreateBlogParams){
        const cookie = request.cookies.jwt;


        return cookie;

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
