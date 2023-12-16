import { Module } from "@nestjs/common";
import { UserModule } from "./User/User.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./ormconfig";
import { AuthModule } from "./Auth/Auth.module";
import  { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./Auth/guard/jwt.guard";
import { ServeStaticModule } from "@nestjs/serve-static";
import { GameModule } from "./Game/Game.module";
import { MatchmakingModule } from "./Game/Matchmaking/Matchmaking.module";
import { ChatModule } from "./Chat/Chat.module";
import { SocketModule } from "./Socket/Socket.module";

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		UserModule,
		AuthModule,
		ChatModule,
		MatchmakingModule,
		GameModule,
		ServeStaticModule.forRoot({ rootPath: __dirname + "/.." + "/avatars", serveRoot: "/avatars" }),
		SocketModule,
	],
	providers: [{
		provide: APP_GUARD,
		useClass: JwtAuthGuard,
	}],
})
export class AppModule {}
