import { Controller, Post, Get, Patch, Delete, Body } from '@nestjs/common';
import { CreateBlogDto } from 'src/blogs/dtos/create-blog.dto';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';

@Controller('blogs')
export class BlogsController {
    
    constructor(
        private readonly blogService: BlogsService,
    ){}

    @Post('create')
    createBlog(@Body() createBlogDto: CreateBlogDto){
        return this.blogService.createBlog(createBlogDto);
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
