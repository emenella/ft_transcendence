import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const corsConfig = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(4200);
}
bootstrap();
