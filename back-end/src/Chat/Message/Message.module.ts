import { Module } from "@nestjs/common";
import { MessageControllers } from "./Message.controller";
import { MessageService } from "./Message.service";
import { Message } from "./Message.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User} from "../../User/entity/User.entity";
import { Chan} from "../Chan/Chan.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Message, User, Chan])],
    controllers: [MessageControllers],
    providers: [MessageService],
    exports: [MessageService]
})
export class MessageModule {}