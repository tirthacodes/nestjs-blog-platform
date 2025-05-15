import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe);
  app.useGlobalInterceptors( new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());
  app.enableCors({
    //origin: 'http://localhost:3000',
    //origin: '*',  // Allow all, just for now
    //origin: 'http://localhost:5500', // Changing this to match Live Server address
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],  // Allow both

    credentials: true
  })

  const config = new DocumentBuilder()
    .setTitle('NestJs Blog Platform')
    .setDescription('A RESTful API for managing blog posts and comments. Allows users to create, read, update, and delete blog posts and comments. Supports user authentication for managing their own content. Returns data in JSON format.')
    .setVersion('1.0.0')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
