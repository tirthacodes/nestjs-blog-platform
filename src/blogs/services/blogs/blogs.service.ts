import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/blog.entity';
import { CreateBlogParams } from 'src/blogs/blog.types';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>
    ){}

    createBlog(userDetails: CreateBlogParams){
        const newUser = this.blogRepository.create({...userDetails});

        try{
            this.blogRepository.save(newUser);
            return{
                message: "blog created success!"
            }
        }
        catch(e){
            return new InternalServerErrorException();
        }
    }
}
