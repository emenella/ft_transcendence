import { Module, forwardRef } from "@nestjs/common";
import { GameGateway } from "./Game.Gateway";
import { GameService } from "./Game.service";
import { AuthModule } from "../Auth/Auth";
import { UserModule } from "../User/User.module";
import { GameController } from "./Game.controller";
import { SocketModule } from "../Socket/Socket.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        forwardRef(() => SocketModule)
    ],
    controllers: [GameController],
    providers: [GameGateway, GameService],
    exports: [GameService]
})
export class GameModule {}