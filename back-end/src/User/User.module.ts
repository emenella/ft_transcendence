import { Module, forwardRef } from "@nestjs/common";
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
import { SocketModule } from "../Socket/Socket.module";
import { AuthModule } from "../Auth/Auth";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Connection, Match]),
		MulterModule.registerAsync({useFactory: factory, imports:[UserModule], inject: [UserService]}),
		forwardRef(() => AuthModule),
        forwardRef(() => SocketModule)
	],
	controllers: [UserController],
	providers: [UserService, ConnectionService, HistoryService],
	exports: [UserService, ConnectionService, HistoryService]
})
export class UserModule {}
