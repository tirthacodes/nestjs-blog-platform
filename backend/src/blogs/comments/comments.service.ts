import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments-entities/comment.entity';
import { Not, Repository } from 'typeorm';
import { CreateCommentParams } from './comment.types';
import { JwtService } from '@nestjs/jwt';

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
        try{
            await this.getUserIdfromToken(token);
            const comments = this.commentRepo.find({where: { blog: {id:blogId}}, relations: ['blog'] });
            return comments;
        }
        catch(error){
            if (error instanceof UnauthorizedException) {
                throw error; // Re-throw the UnauthorizedException
            } else {
                throw new InternalServerErrorException('An error occurred while fetching comments.');
            }
        }
    }

    async createComment(blogId: number, token: string, commentDetails: CreateCommentParams){
        try{
            const userId = this.getUserIdfromToken(token);

            const blog = await this.commentRepo.findOne({ where: {blog: { id: blogId }}, relations: ['blog'] });

            if (!blog) {
                throw new NotFoundException('Blog not found.');
            }

            const newComment = this.commentRepo.create({
                ...commentDetails,
                user: {id: userId},
                blog: {id: blogId},
            });

            await this.commentRepo.save(newComment);
        
            return {
                content: newComment.text,
                message: "Comment created successfully!",
            };   
        }
        catch(error){
            if(error instanceof UnauthorizedException){
                throw error;
            }
            else{
                throw new InternalServerErrorException('Failed to comment!')
            }
        }    
    }

    async deleteComment(blogId: number, token: string, commentId: number){
        try{
            const userId = this.getUserIdfromToken(token);
            const blog = await this.commentRepo.findOne({ where: {blog: { id: blogId }}, relations: ['blog'] });

            if (!blog) {
                throw new NotFoundException(`Blog not found.`);
            }

            const comment = await this.commentRepo.findOne({ where: { id: commentId }, relations: ['user', 'blog', 'blog.user'] });

            if (!comment) {
                throw new NotFoundException(`Comment not found`);
            }

            if (comment.user.id === userId || comment.blog.user.id == userId) {
                // If authorized, delete the comment
                await this.commentRepo.delete(commentId);
                return{
                message: 'Comment deleted!'
            };
            }
            else{
                throw new UnauthorizedException('You are not authorized to delete this comment');
            }   
        }
        catch(error){
            if(error instanceof NotFoundException){
                throw error;
            }
            else if(error instanceof UnauthorizedException){
                throw error;
            }
            else{
                throw new InternalServerErrorException('An error occurred while processing your request.');
            }
        }
    }
}
