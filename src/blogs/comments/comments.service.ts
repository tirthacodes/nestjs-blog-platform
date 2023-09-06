import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments-entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentParams } from './comment.types';
import { JwtService } from '@nestjs/jwt';
import { Blog } from '../blog.entity';
import { error } from 'console';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo : Repository<Comment>,
        //private readonly blogRepo: Repository<Blog>,
        private jwtService: JwtService,
    ){}

    private getUserIdfromToken(token: string){
        try{
            const data = this.jwtService.verify(token);
            return data.sub;
        }
        catch(error){
            throw new UnauthorizedException('Invalid Token');
        }
    }

    async comments(blogId: number, token: string){
        const userId = await this.getUserIdfromToken(token);
        const comments = this.commentRepo.find({where: { blog: {id:blogId}}, relations: ['blog'] });
        return comments;
    }

    async createComment(blogId: number, token: string, commentDetails: CreateCommentParams){
        const userId = this.getUserIdfromToken(token);

        const blog = await this.commentRepo.find({where: {id: blogId}, relations: ['blog']});

        //const blog = await this.commentRepo.findOne({where: {id: blogId}, });
        try{
            if (!blog) {
                throw new NotFoundException('Blog not found');
              }
    
            const newComment = this.commentRepo.create({
                ...commentDetails,
                user: {id: userId},
                blog: {id: blogId},
            });
    
            await this.commentRepo.save(newComment);
            return newComment;
        }
        catch(e){
            throw new NotFoundException('Blog not found');
        }    
    }

    async deleteComment(blogId: number, token: string, commentId: number){
        const userId = this.getUserIdfromToken(token);

        const comment = await this.commentRepo.findOne({ where: { id: commentId }, relations: ['user', 'blog', 'blog.user'] });
        console.log(comment);

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.user.id === userId || comment.blog.user.id == userId) {
            // If authorized, delete the comment
            await this.commentRepo.delete(commentId);
            return{
            message: 'comment deleteddd'
        };
        }
        else{
            throw new UnauthorizedException('You are not authorized to delete this comment');
        } 
    }
}
