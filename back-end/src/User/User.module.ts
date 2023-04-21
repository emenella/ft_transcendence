import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { factory } from "./utils/multer.utils";
import { User } from "./entity/User.entity";
import { UserController } from "./User.controller";
import { UserService } from "./service/User.service";
import { Connection } from "./entity/Connection.entity";
import { ConnectionService } from "./service/Connection.service";
import { MatchService } from "./service/Match.service";
import { Match } from "./entity/Match.entity";
import { SocketModule } from "../Socket/Socket.module";
import { AuthModule } from "../Auth/Auth.module";
import { ChatModule } from "../Chat/Chat.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Connection, Match]),
		MulterModule.registerAsync({useFactory: factory, imports:[UserModule], inject: [UserService]}),
        forwardRef(() => SocketModule),
		forwardRef(() => AuthModule),
		forwardRef(() => ChatModule)
	],
	controllers: [UserController],
	providers: [UserService, ConnectionService, MatchService],
	exports: [UserService, ConnectionService, MatchService]
})
export class UserModule {}
