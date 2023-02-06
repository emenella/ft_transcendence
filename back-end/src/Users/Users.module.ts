import { Module } from "@nestjs/common";
import { UserControllers } from "./User.controller";
import { UserService } from "./User.service";
import { User } from "./User.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chan } from '../Chat/Chan.entity';
import { Message } from '../Chat/Message/Message.entity';
import { ChanService } from "src/Chat/Chan.service";
import { MessageService } from "src/Chat/Message/Message.service";
import { ChanControllers } from "src/Chat/Chan.controller";
import { MessageControllers } from "src/Chat/Message/Message.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserControllers, ChanControllers, MessageControllers],
    providers: [UserService, ChanService, MessageService],
    exports: [UserService]
})
export class UserModule {}