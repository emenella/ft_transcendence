import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const corsConfig = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  await app.listen(4200);
}
bootstrap();