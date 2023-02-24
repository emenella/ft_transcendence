import { Module } from "@nestjs/common";
import { ChanService } from "./Chan.service";
import { Chan, RelationTable } from "./Chan.entity";
import { ChanPasswordService } from "./Chan.password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/Users/Users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Chan, RelationTable]), UserModule],
    providers: [ChanPasswordService, ChanService],
    exports: [ChanService]
})
export class ChanModule {}