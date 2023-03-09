import { Module } from "@nestjs/common";
import { ChanService } from "./Chan.service";
import { Chan, RelationTable } from "./Chan.entity";
import { ChanPasswordService } from "./Chan.password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../../Users/service/User.service";

@Module({
    imports: [TypeOrmModule.forFeature([Chan, RelationTable])],
    providers: [ChanPasswordService, ChanService, UserService],
    exports: [ChanService]
})
export class ChanModule {}