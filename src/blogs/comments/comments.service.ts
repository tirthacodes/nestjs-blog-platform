import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments-entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './comments-dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo : Repository<Comment>
    ){}

    createComment(commentDetails: CreateCommentDto){
        
    }
}
