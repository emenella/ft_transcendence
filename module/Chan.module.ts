import { Module, forwardRef } from "@nestjs/common";
import { ChanService } from "./Chan.service";
import { Chan, RelationTable } from "./Chan.entity";
import { ChanPasswordService } from "./Chan.password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../../User/User.module";
import { Message } from "../Message/Message.entity";
import { MessageService } from "../Message/Message.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chan, RelationTable, Message]),
        forwardRef(() => UserModule)
    ],
    providers: [ChanPasswordService, ChanService, MessageService],
    exports: [ChanService]
})
export class ChanModule {}