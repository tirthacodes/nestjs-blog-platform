import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs/blogs.controller';
import { BlogsService } from './services/blogs/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [
  TypeOrmModule.forFeature([Blog]),
  JwtModule.register({
    secret: 'topsecret52',
    signOptions: {
      expiresIn: '1h',
    },
  }),
],
})
export class BlogsModule {}
