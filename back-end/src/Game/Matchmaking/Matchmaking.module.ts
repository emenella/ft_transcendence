import { Module, forwardRef } from "@nestjs/common";
import { MatchmakingGateway } from "./Matchmaking.gateway";
import { MatchmakingService } from "./Matchmaking.service";
import { AuthModule } from "../../Auth/Auth.module";
import { GameModule } from "../Game.module";
import { UserModule } from "../../User/User.module";
import { SocketModule } from "../../Socket/Socket.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		forwardRef(() => GameModule),
        forwardRef(() => SocketModule),
    ],
    controllers: [],
    providers: [MatchmakingGateway, MatchmakingService],
    exports: [MatchmakingService]
})
export class MatchmakingModule {}