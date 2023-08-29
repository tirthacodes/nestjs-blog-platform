import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs/blogs.controller';
import { BlogsService } from './services/blogs/blogs.service';
import { CommentsModule } from './comments/comments.module';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [CommentsModule]
})
export class BlogsModule {}
