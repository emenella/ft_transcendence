import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameService} from './Game.service';
import { AuthenticationService } from '../Auth/Authenfication.service';
import { UserService } from '../Users/service/User.service';

@WebSocketGateway(80, {namespace: 'game'})
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService, private readonly authService: AuthenticationService, private readonly userService: UserService) {}

    afterInit(server: Server) {
        console.log('GameGateway initialized');
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log('GameGateway client connected');
        const payload: any = this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.userId);
        
        if (user) {
            this.gameService.joinPlayer(user.id)
        }
        else {
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        console.log('GameGateway client disconnected');
        const payload: any = this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.userId);
        
        if (user) {
            this.gameService.leavePlayer(user.id)
        }
        client.disconnect();
    }

    @SubscribeMessage('game:event')
    async onGameEvent(client: Socket, data: any): Promise<any> {
        const payload: any = this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.userId);
        if (user) {
            this.gameService.handleGameEvent(user.id, data);
        }
    }

    @SubscribeMessage('game:gameInfo')
    async onGameInfo(client: Socket, data: any): Promise<any> {
        const payload: any = this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.userId);
        if (user) {
            let gameInfo = this.gameService.handleGameInfo(user.id);
            client.emit('game:gameInfo', gameInfo);
        }
    }
}