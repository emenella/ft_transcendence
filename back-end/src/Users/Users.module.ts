import { Module } from "@nestjs/common";
import { UserControllers } from "./User.controller";
import { UserService } from "./service/User.service";
import { User } from "./entity/User.entity";
import { Connection } from "./entity/Connection.entity";
import { ConnectionService } from "./service/Connection.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChanModule } from "src/Chat/Chan/Chan.module";
import { MessageModule } from "src/Chat/Message/Message.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]),
            TypeOrmModule.forFeature([Connection]),
            ChanModule, MessageModule],
    controllers: [UserControllers],
    providers: [UserService, ConnectionService],
    exports: [UserService, ConnectionService]
})
export class UserModule {}