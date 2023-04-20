import { Module } from '@nestjs/common';
import { UserModule } from './User/User.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthModule } from './Auth/Auth';
import  { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Auth/guard/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameModule } from './Game/Game.module';
import { MatchmakingModule } from './Game/Matchmaking/Matchmaking.module';
import { ChatModule } from './Chat/Chat.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		UserModule,
		AuthModule,
		ChatModule,
		GameModule,
		MatchmakingModule,
		ServeStaticModule.forRoot({ rootPath: __dirname + '/..' + '/avatars', serveRoot: '/avatars' })
	],
	providers: [{
		provide: APP_GUARD,
		useClass: JwtAuthGuard,
	}],
})
export class AppModule {}
