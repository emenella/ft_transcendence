import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "../User/User.module";
import { AuthModule } from "../Auth/Auth.module";
import { ChatModule } from "../Chat/Chat.module";
import { GameModule } from "../Game/Game.module";
import { MatchmakingModule } from "../Game/Matchmaking/Matchmaking.module";
import { SocketService } from "./Socket.service";
import { SocketGateway } from "./Socket.gateway";
import { WsThrottlerGuard } from "./utils/ThrottlerGuard"
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		forwardRef(() => ChatModule),
		forwardRef(() => GameModule),
		forwardRef(() => MatchmakingModule),
		ThrottlerModule.forRoot({ ttl: 30, limit: 300 }),
	],
	providers: [SocketGateway, SocketService, WsThrottlerGuard],
	exports: [SocketService],
})
export class SocketModule {}