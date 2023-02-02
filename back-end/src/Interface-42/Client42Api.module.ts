import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { Client42ApiService } from "./Client42Api.service";

@Module({
    imports: [HttpModule],
    providers: [Client42ApiService],
    exports: [Client42ApiService],
})

export class Client42ApiModule {}