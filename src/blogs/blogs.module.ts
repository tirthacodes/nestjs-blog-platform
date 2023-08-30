import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs/blogs.controller';
import { BlogsService } from './services/blogs/blogs.service';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [CommentsModule,
  TypeOrmModule.forFeature([Blog])
],
})
export class BlogsModule {}
