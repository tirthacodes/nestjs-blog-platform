import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments-entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentParams } from './comment.types';
import { JwtService } from '@nestjs/jwt';
import { Blog } from '../blog.entity';

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
}
