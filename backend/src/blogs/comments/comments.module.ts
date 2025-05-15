import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments-entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { Blog } from '../blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog]),
  JwtModule.register({
    secret: 'topsecret52',
    signOptions: {
      expiresIn: '1h',
    },
  }),
],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
