import { Controller, Post, Get, Patch, Delete } from '@nestjs/common';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';

@Controller('blogs')
export class BlogsController {
    
    constructor(
        private readonly blogService: BlogsService,
    ){}

    @Post('create')
    createBlog(){

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
