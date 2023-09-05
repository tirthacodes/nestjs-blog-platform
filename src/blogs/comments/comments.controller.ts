import { Body, Controller, Post, ParseIntPipe, Param, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { CreateCommentDto } from './comments-dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('blogs')
export class CommentsController {
    constructor(
        private readonly commentService : CommentsService
    ){}

    @Get(':blogId/comments')
    comments(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Req() request: Request,
    ){
        const token = request.cookies.jwt;
        const result = this.commentService.comments(blogId, token);
        return result;
    }

    @Post(':blogId/createComment')
    createComment(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() request: Request
    ){
        const token = request.cookies.jwt;
        const result = this.commentService.createComment(blogId, token, createCommentDto);
        return result;
    }
}
