import { Module } from '@nestjs/common';
import { UserModule } from './Users/Users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthenticationModule } from './Auth/Authenfication.module';
import  { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Auth/guard/jwt.guard';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(typeOrmConfig), AuthenticationModule],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
