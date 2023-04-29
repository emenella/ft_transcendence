import { Module, forwardRef } from "@nestjs/common";
import { GameService } from "./Game.service";
import { AuthModule } from "../Auth/Auth.module";
import { UserModule } from "../User/User.module";
import { GameController } from "./Game.controller";
import { SocketModule } from "../Socket/Socket.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}