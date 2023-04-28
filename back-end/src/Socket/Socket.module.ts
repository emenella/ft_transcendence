import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "../User/User.module";
import { AuthModule } from "../Auth/Auth.module";
import { ChatModule } from "../Chat/Chat.module";
import { GameModule } from "../Game/Game.module";
import { MatchmakingModule } from "../Game/Matchmaking/Matchmaking.module";
import { SocketService } from "./Socket.service";
import { SockEvent, SocketGateway } from "./Socket.gateway";

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		forwardRef(() => ChatModule),
		forwardRef(() => GameModule),
		forwardRef(() => MatchmakingModule),
	],
	providers: [SocketGateway, SocketService],
	exports: [SocketService],
})
export class SocketModule {}