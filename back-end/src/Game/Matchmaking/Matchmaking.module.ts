import { Module } from "@nestjs/common";
import { MatchmakingGateway } from "./Matchmaking.gateway";
import { MatchmakingService } from "./Matchmaking.service";
import { AuthModule } from "../../Auth/Auth";
import { GameModule } from "../Game.module";
import { UserModule } from "../../User/User.module";

@Module({
    imports: [AuthModule, UserModule, GameModule],
    controllers: [],
    // providers: [MatchmakingService],
    providers: [MatchmakingGateway, MatchmakingService],
    exports: [MatchmakingService]
})
export class MatchmakingModule {}