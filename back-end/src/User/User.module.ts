import { Module } from "@nestjs/common";
import { UserController } from "./User.controller";
import { UserService } from "./service/User.service";
import { User } from "./entity/User.entity";
import { Connection } from "./entity/Connection.entity";
import { ConnectionService } from "./service/Connection.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { factory } from "./utils/multer.utils";
import { HistoryService } from "./service/Match.service";
import { Match } from "./entity/Match.entity";
import { Avatar } from "./entity/Avatar.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Connection, Avatar, Match]), MulterModule.registerAsync({useFactory: factory, imports:[UserModule], inject: [UserService]})],
    controllers: [UserController],
    providers: [UserService, ConnectionService, HistoryService],
    exports: [UserService, ConnectionService, HistoryService]
})
export class UserModule {}