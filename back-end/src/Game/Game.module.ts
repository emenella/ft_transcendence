import { Module, forwardRef } from "@nestjs/common";
import { GameGateway } from "./Game.Gateway";
import { GameService } from "./Game.service";
import { AuthModule } from "../Auth/Auth";
import { UserModule } from "../User/User.module";
import { GameController } from "./Game.controller";

@Module({
    imports: [forwardRef(() => UserModule), forwardRef(() => AuthModule)],
    controllers: [GameController],
    providers: [GameGateway, GameService],
    exports: [GameService]
})
export class GameModule {}