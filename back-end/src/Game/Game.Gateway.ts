import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameService} from './Game.service';

@WebSocketGateway()
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService) {}

    @SubscribeMessage('game')
    async handleGame(@MessageBody() data: any, @MessageBody() client: Socket) {
        console.log(data);
        console.log(client);
    }

    @SubscribeMessage('game:join')
    async handleJoin(@MessageBody() data: any, @MessageBody() client: Socket) {
        console.log(data);
        console.log(client);
    }

    @SubscribeMessage('game:leave')
    async handleLeave(@MessageBody() data: any, @MessageBody() client: Socket) {
        console.log(data);
        console.log(client);
    }

    @SubscribeMessage('game:paddle')
    async handlePaddle(@MessageBody() data: any, @MessageBody() client: Socket) {
        console.log(data);
        console.log(client);
    }

    @SubscribeMessage('game:ball')
    async handleBall(@MessageBody() data: any, @MessageBody() client: Socket) {
        console.log(data);
        console.log(client);
    }

    @SubscribeMessage('game:score')
    async handleScore(@MessageBody() data: any, @MessageBody() client: Socket) {
        console.log(data);
        console.log(client);
    }
}