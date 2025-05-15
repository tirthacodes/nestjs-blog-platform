import { Controller, Post, Get, Patch, Delete, Body, Req, Param, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { Blog } from 'src/blogs/blog.entity';
import { UpdateBlogParams } from 'src/blogs/blog.types';
import { CreateBlogDto } from 'src/blogs/dtos/create-blog.dto';
import { UpdateBlogDto } from 'src/blogs/dtos/update-blog.dto';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@Controller('blogs')
@ApiTags('Blogs')
export class BlogsController {
    
    constructor(
        private readonly blogService: BlogsService,
    ){}

    @Post('create')
    @ApiOperation({ summary: 'Create a new blog' })
    @ApiResponse({ status: 201, description: 'Blog created successfully', type: Blog })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async createBlog(@Req() request: Request ,@Body() createBlogDto: CreateBlogDto) : Promise<{message: string}> {
        const token = request.cookies.jwt;   
        return this.blogService.createBlog(token,createBlogDto);
    }

    @Get('self')
    @ApiOperation({ summary: 'Get blogs created by the authenticated user' })
    @ApiResponse({ status: 200, description: 'Blogs found', type: [Blog] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getMyBlogs(@Req() request: Request) : Promise<Blog[]> {
        const token = request.cookies.jwt;
        return this.blogService.getMyBlogs(token);
    }

    @Get('')
    @ApiOperation({ summary: 'Get all blogs' })
    @ApiResponse({ status: 200, description: 'Blogs found', type: [Blog] })
    getBlogs() : Promise<Blog[]> {
        return this.blogService.getBlogs();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a blog by ID' })
    @ApiResponse({ status: 200, description: 'Blog found', type: Blog })
    @ApiResponse({ status: 404, description: 'Blog not found' })
    getBlogById(@Param('id', ParseIntPipe) id: number): Promise<Blog | undefined> {
        return this.blogService.getBlogById(id);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Update a blog by ID' })
    @ApiResponse({ status: 200, description: 'Blog updated successfully', type: Blog })
    @ApiResponse({ status: 404, description: 'Blog not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    updateBlog(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Body() updateBlogDto: UpdateBlogDto) : Promise<{ blog: UpdateBlogParams, message: string }>{
        const token = request.cookies.jwt;
        return this.blogService.updateBlog(id, token, updateBlogDto);
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete a blog by ID' })
    @ApiResponse({ status: 204, description: 'Blog deleted successfully' })
    @ApiResponse({ status: 404, description: 'Blog not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    deleteBlog(@Param('id', ParseIntPipe) id: number, @Req() request: Request){
        const token = request.cookies.jwt;
        return this.blogService.deleteBlog(id, token);
    }
}
