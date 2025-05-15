import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { UsersController } from './controller/users/users.controller';
import { UsersService } from './services/users/users.service';
import { JwtModule } from '@nestjs/jwt/dist';
import { User } from './entities/users.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'topsecret52',
      signOptions:{
        expiresIn: '1h',
      },
    }),
    TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
