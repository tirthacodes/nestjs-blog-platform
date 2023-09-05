import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { join } from 'path';
import { User } from './users/entities/users.entity';
import { CommentsController } from './blogs/comments/comments.controller';
import { Blog } from './blogs/blog.entity';
import { Comment } from './blogs/comments/comments-entities/comment.entity';
import { CommentsModule } from './blogs/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_blog_platform',
      entities: [User, Blog, Comment],
      synchronize: true,
    }),
    UsersModule,
    BlogsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
