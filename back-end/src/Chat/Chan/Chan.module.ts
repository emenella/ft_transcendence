import { Module } from "@nestjs/common";
import { ChanControllers } from "./Chan.controller";
import { ChanService } from "./Chan.service";
import { Chan } from "./Chan.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageModule } from "../Message/Message.module";
import { UserModule } from "src/Users/Users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Chan]), MessageModule, UserModule],
    controllers: [ChanControllers],
    providers: [ChanService],
    exports: [ChanService]
})
export class ChanModule {}