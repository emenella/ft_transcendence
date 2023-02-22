import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  // cors format: { origin: string, methods: string, allowedHeaders: string, credentials: boolean, maxAge: number }
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(4200);
}
bootstrap();
