import { Module, forwardRef } from "@nestjs/common";
import { GameGateway } from "./Game.Gateway";
import { GameService } from "./Game.service";
import { AuthModule } from "../Auth/Auth.module";
import { UserModule } from "../User/User.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule)
    ],
    controllers: [],
    providers: [GameGateway, GameService],
    exports: [GameService]
})
export class GameModule {}