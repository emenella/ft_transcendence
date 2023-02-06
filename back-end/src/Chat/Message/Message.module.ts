import { Module } from "@nestjs/common";
import { MessageControllers } from "./Message.controller";
import { MessageService } from "./Message.service";
import { Message } from "./Message.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChanService } from "../Chan.service";
import { ChanControllers } from "../Chan.controller";
import { Chan } from '../Chan.entity';
import { UserControllers } from "src/Users/User.controller";
import { UserService } from "src/Users/User.service";
import { User } from "src/Users/User.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    controllers: [MessageControllers, UserControllers, ChanControllers],
    providers: [MessageService, ChanService, UserService],
    exports: [MessageService]
})
export class MessageModule {}