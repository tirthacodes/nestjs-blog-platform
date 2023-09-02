import { Controller, Post, Get, Patch, Delete, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateBlogDto } from 'src/blogs/dtos/create-blog.dto';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';

@Controller('blogs')
export class BlogsController {
    
    constructor(
        private readonly blogService: BlogsService,
    ){}

    @Post('create')
    async createBlog(@Req() request: Request ,@Body() createBlogDto: CreateBlogDto){       
        return this.blogService.createBlog(request,createBlogDto);
    }

    @Get('test')
    async test(@Req() request : Request){
        return this.blogService.test(request);
    }

    @Get()
    getAllBlogs(){

    }

    @Get(':id')
    getBlogById(){

    }

    @Patch('update/:id')
    updateBlog(){

    }

    @Delete('delete/:id')
    deleteBlog(){

    }
}
