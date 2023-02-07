import { Module } from "@nestjs/common";
import { UserControllers } from "./User.controller";
import { UserService } from "./User.service";
import { User } from "./User.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChanModule } from "src/Chat/Chan.module";
import { MessageModule } from "src/Chat/Message/Message.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), ChanModule, MessageModule],
    controllers: [UserControllers],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}