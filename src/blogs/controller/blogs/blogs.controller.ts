import { Controller, Post, Get, Patch, Delete, Body, Req, Param, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { Blog } from 'src/blogs/blog.entity';
import { CreateBlogDto } from 'src/blogs/dtos/create-blog.dto';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';

@Controller('blogs')
export class BlogsController {
    
    constructor(
        private readonly blogService: BlogsService,
    ){}

    @Post('create')
    async createBlog(@Req() request: Request ,@Body() createBlogDto: CreateBlogDto){
        const token = request.cookies.jwt;   
        return this.blogService.createBlog(token,createBlogDto);
    }

    @Get('myblogs')
    getMyBlogs(@Req() request: Request) : Promise<Blog[]> {
        const token = request.cookies.jwt;
        return this.blogService.getMyBlogs(token);
    }

    @Get('')
    getBlogs(){
        return this.blogService.getBlogs();
    }

    @Get(':id')
    getBlogById(@Param('id', ParseIntPipe) id: number): Promise<Blog> {
        return this.blogService.getBlogById(id);
    }

    @Patch('update/:id')
    updateBlog(){

    }

    @Delete('delete/:id')
    deleteBlog(){

    }
}
