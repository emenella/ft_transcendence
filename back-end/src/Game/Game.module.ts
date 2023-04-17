import { Module } from "@nestjs/common";
import { GameGateway } from "./Game.Gateway";
import { GameService } from "./Game.service";
import { AuthenticationModule } from "../Auth/Authenfication.module";
import { UserModule } from "../User/User.module";


@Module({
    imports: [AuthenticationModule, UserModule],
    controllers: [],
    providers: [GameGateway, GameService],
    exports: [GameService]
})
export class GameModule {}