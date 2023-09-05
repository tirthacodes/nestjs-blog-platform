import { Body, Controller, Post } from '@nestjs/common';
import { CreateCommentDto } from './comments-dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentService : CommentsService
    ){}

    @Post('create')
    createComment(@Body() createCommentDto: CreateCommentDto){
        const result = this.commentService.createComment(createCommentDto);
        return result;
    }
}
