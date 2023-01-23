import { Module } from "@nestjs/common";
import { UserControllers } from "./User.controller";
import { UserService } from "./User.service";
import { User } from "./User.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserControllers],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}