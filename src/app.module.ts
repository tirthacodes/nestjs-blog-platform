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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_blog_platform',
      entities: [User, Blog],
      synchronize: true,
    }),
    UsersModule, BlogsModule],
  controllers: [AppController, CommentsController],
  providers: [AppService],
})
export class AppModule {}
