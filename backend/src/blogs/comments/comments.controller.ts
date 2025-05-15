import { Body, Controller, Post, ParseIntPipe, Param, Req, Get, Delete } from '@nestjs/common';
import { Request } from 'express';
import { CreateCommentDto } from './comments-dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Comment } from './comments-entities/comment.entity';

@Controller('blogs')
@ApiTags('Comments')
export class CommentsController {
    constructor(
        private readonly commentService : CommentsService
    ){}

    @Get(':blogId/comments')
    @ApiOperation({ summary: 'Get comments for a blog' })
    @ApiResponse({ status: 200, description: 'Comments found', type: [Comment] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    comments(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Req() request: Request,
    ){
        const token = request.cookies.jwt;
        const result = this.commentService.comments(blogId, token);
        return result;
    }

    @Post(':blogId/createComment')
    @ApiOperation({ summary: 'Create a new comment for a blog' })
    @ApiResponse({ status: 201, description: 'Comment created successfully', type: Comment })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Blog not found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    createComment(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() request: Request
    ){
        const token = request.cookies.jwt;
        const result = this.commentService.createComment(blogId, token, createCommentDto);
        return result;
    }

    @Delete(':blogId/deletecomment/:cid')
    @ApiOperation({ summary: 'Delete a comment for a blog by ID' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Blog or Comment not found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    deleteComment(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Param('cid', ParseIntPipe) cid: number,
        @Req() request: Request
    ){
        const token = request.cookies.jwt;
        return this.commentService.deleteComment(blogId, token, cid);
    }
}
