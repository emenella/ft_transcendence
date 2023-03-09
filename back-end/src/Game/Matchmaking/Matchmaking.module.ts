import { Module } from "@nestjs/common";
// import { MatchmakingGateway } from "./Matchmaking.gateway";
import { MatchmakingService } from "./Matchmaking.service";
import { AuthenticationModule } from "../../Auth/Authenfication.module";
import { GameModule } from "../Game.module";
import { UserModule } from "../../Users/Users.module";

@Module({
    imports: [AuthenticationModule, UserModule, GameModule],
    controllers: [],
    providers: [MatchmakingService],
    // providers: [MatchmakingGateway, MatchmakingService],
    exports: [MatchmakingService]
})
export class MatchmakingModule {}