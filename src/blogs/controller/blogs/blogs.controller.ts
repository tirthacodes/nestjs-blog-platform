import { Controller, Post, Get, Patch, Delete, Body, Req, Param, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { Blog } from 'src/blogs/blog.entity';
import { UpdateBlogParams } from 'src/blogs/blog.types';
import { CreateBlogDto } from 'src/blogs/dtos/create-blog.dto';
import { UpdateBlogDto } from 'src/blogs/dtos/update-blog.dto';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';

@Controller('blogs')
export class BlogsController {
    
    constructor(
        private readonly blogService: BlogsService,
    ){}

    @Post('create')
    async createBlog(@Req() request: Request ,@Body() createBlogDto: CreateBlogDto) : Promise<{message: string}> {
        const token = request.cookies.jwt;   
        return this.blogService.createBlog(token,createBlogDto);
    }

    @Get('self')
    getMyBlogs(@Req() request: Request) : Promise<Blog[]> {
        const token = request.cookies.jwt;
        return this.blogService.getMyBlogs(token);
    }

    @Get('')
    getBlogs() : Promise<Blog[]> {
        return this.blogService.getBlogs();
    }

    @Get(':id')
    getBlogById(@Param('id', ParseIntPipe) id: number): Promise<Blog | undefined> {
        return this.blogService.getBlogById(id);
    }

    @Patch('update/:id')
    updateBlog(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Body() updateBlogDto: UpdateBlogDto) : Promise<{ blog: UpdateBlogParams, message: string }>{
        const token = request.cookies.jwt;
        return this.blogService.updateBlog(id, token, updateBlogDto);
    }

    @Delete('delete/:id')
    deleteBlog(@Param('id', ParseIntPipe) id: number, @Req() request: Request){
        const token = request.cookies.jwt;
        return this.blogService.deleteBlog(id, token);
    }
}
