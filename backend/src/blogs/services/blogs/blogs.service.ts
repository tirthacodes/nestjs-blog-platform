import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Blog } from 'src/blogs/blog.entity';
import { CreateBlogParams, UpdateBlogParams } from 'src/blogs/blog.types';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateBlogDto } from 'src/blogs/dtos/update-blog.dto';

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

    async createBlog(token: string,userDetails: CreateBlogParams) : Promise<{message: string}> {
        const userId = this.getUserIdfromToken(token)

        const newBlog = this.blogRepository.create({
            title: userDetails.title,
            content: userDetails.content,
            user: userId,
        });

        try{
            await this.blogRepository.save(newBlog);
            return{
                message: "Blog created successfully!"
            }
        }
        catch(e){
            return new InternalServerErrorException('Failed to create new blog');
        }
    }

    async getMyBlogs(token: string): Promise<Blog[]> {
        const userId = this.getUserIdfromToken(token);
        return this.blogRepository.find({where: {user: {id : userId}}});
        // createQueryBuilder('blog')
        // .where('blog.user.id = :userId', { userId })
        // .getMany();
    }

    async getBlogs() : Promise<Blog[]> {
        return this.blogRepository.find();
    }

    async getBlogById(id : number) : Promise<Blog | undefined> {
        const blog = await this.blogRepository.findOneBy({ id });

        if(!blog){
            throw new NotFoundException('Blog Not Found.');
        }
        return blog;
    }

    async updateBlog(id: number, token: string, updateBlogDetails: UpdateBlogParams) : Promise<{ blog: UpdateBlogParams, message: string }>{

        const userId = this.getUserIdfromToken(token);
        const blog = await this.blogRepository.findOne({where:{ id: id}, relations: ['user']});
    
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        if (blog.user.id !== userId) {
            throw new ForbiddenException('You do not have permission to update this blog');
        }

        blog.title = updateBlogDetails.title;
        blog.content = updateBlogDetails.content;

        await this.blogRepository.save(blog);

        const updatedBlog: UpdateBlogParams = {
            title: blog.title,
            content: blog.content,
        };
        return { blog: updatedBlog, message: 'Blog updated successfully!' };
    }

    async deleteBlog(id: number, token: string) : Promise<{message: string}> {
        const userId = this.getUserIdfromToken(token);

        const blog = await this.blogRepository.findOne({where:{ id: id}, relations: ['user']});

        //blog exist?
        if (!blog) {
            throw new NotFoundException('Blog not found.');
        }

        //ownership?
        if (blog.user.id !== userId) {
            throw new ForbiddenException('You do not have permission to delete this blog.');
        }

        this.blogRepository.delete({ id: id });

        return{
            message: `Blog with title '${blog.title}' deleted!`
        };
    }

}
