import { Module } from "@nestjs/common";
import { GameGateway } from "./Game.gateway";
import { WebSocketGateway } from "@nestjs/websockets"
import { GameService } from "./Game.service";

@Module({
    imports: [WebsocketGateway.forRoot()],
    providers: [GameService],