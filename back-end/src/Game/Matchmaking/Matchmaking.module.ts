import { Module, forwardRef } from "@nestjs/common";
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
    providers: [MatchmakingService],
    exports: [MatchmakingService]
})
export class MatchmakingModule {}