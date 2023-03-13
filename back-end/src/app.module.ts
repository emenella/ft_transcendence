import { Module } from '@nestjs/common';
import { UserModule } from './Users/Users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthenticationModule } from './Auth/Authenfication.module';
import  { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Auth/guard/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameModule } from './Game/Game.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(typeOrmConfig), AuthenticationModule, GameModule, ServeStaticModule.forRoot({ rootPath: __dirname + '/..' + '/uploads', serveRoot: '/uploads' })],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
