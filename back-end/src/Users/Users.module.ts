import { Module } from "@nestjs/common";
import { UserControllers } from "./User.controller";
import { UserService } from "./service/User.service";
import { User } from "./entity/User.entity";
import { Connection } from "./entity/Connection.entity";
import { ConnectionService } from "./service/Connection.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { factory } from "./utils/multer.utils";

@Module({
    imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Connection]), MulterModule.registerAsync({useFactory: factory, imports:[UserModule], inject: [UserService]}) ],
    controllers: [UserControllers],
    providers: [UserService, ConnectionService],
    exports: [UserService, ConnectionService]
})
export class UserModule {}