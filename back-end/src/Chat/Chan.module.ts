import { Module } from "@nestjs/common";
import { ChanControllers } from "./Chan.controller";
import { ChanService } from "./Chan.service";
import { Chan } from "./Chan.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from './Message/Message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Chan])],
    controllers: [ChanControllers],
    providers: [ChanService, Message],
    exports: [ChanService]
})
export class ChanModule {}