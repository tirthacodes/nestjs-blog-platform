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

    async createComment(commentDetails: CreateCommentDto){
        const newComment = this.commentRepo.create({
            content: commentDetails.content,
        });

        await this.commentRepo.save(newComment);
        return newComment;
    }
}
