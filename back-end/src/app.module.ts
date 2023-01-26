import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Users/Users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthenticationModule } from './Auth/Authenfication.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(typeOrmConfig), AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
