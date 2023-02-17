import { Module } from "@nestjs/common";
import { MessageControllers } from "./Message.controller";
import { MessageService } from "./Message.service";
import { Message } from "./Message.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/Users/Users.module";
import { ChanModule } from "../Chan/Chan.module";

@Module({
    imports: [TypeOrmModule.forFeature([Message]), UserModule, ChanModule],
    controllers: [MessageControllers],
    providers: [MessageService],
    exports: [MessageService]
})
export class MessageModule {}