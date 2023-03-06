import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameService} from './Game.service';
import { AuthenticationService } from '../Auth/Authenfication.service';
import { UserService } from '../Users/service/User.service';
import { Setup } from './interface/Game.interface';
import { Body } from '@nestjs/common';

@WebSocketGateway(81, {namespace: 'game', cors: true})
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService, private readonly authService: AuthenticationService, private readonly userService: UserService) {}

    afterInit(server: Server) {
        console.log('GameGateway initialized');
    }

    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (!user) {
            client.disconnect();
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        
        if (user) {
            let ret  = this.gameService.leavePlayer(user.id);
            if (!ret) {
                this.gameService.leaveSpectator(user.id);
            }
        }
        client.disconnect();
    }

    @SubscribeMessage('game:event')
    async onGameEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            this.gameService.handleGameEvent(user.id, data);
        }
    }

    @SubscribeMessage('game:join')
    async onGameJoin(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            this.gameService.joinPlayer(data, user.id, client);
        }
    }

    @SubscribeMessage('game:search')
    async onGameSearch(@ConnectedSocket() client: Socket): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            const games = this.gameService.findGamesIdWithPlayer(user.id);
            client.emit('game:search', games);
        }
    }

    @SubscribeMessage('game:leave')
    async onGameLeave(@ConnectedSocket() client: Socket): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            this.gameService.leavePlayer(user.id);
        }
    }

    @SubscribeMessage('game:ready')
    async onGameReady(client: Socket): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            this.gameService.setPlayerReady(user.id);
        }
    }

    // @SubscribeMessage('game:setup')
    // async onGameSetup(@ConnectedSocket() client: Socket): Promise<any> {
    //     const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
    //     const user = await this.userService.getUserFromConnectionId(payload.connectionId);
    //     if (user) {
    //         let setup: Setup = this.gameService.getGameSetup(user.id);
    //         client.emit('game:setup', setup);
    //     }
    // }

    @SubscribeMessage('game:info')
    async onGameInfo(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            let game = this.gameService.getGameInfo(user.id);
            client.emit('game:info', game);
        }
    }

    @SubscribeMessage('game:spec')
    async onGameSpec(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
        const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
        const user = await this.userService.getUserFromConnectionId(payload.connectionId);
        if (user) {
            this.gameService.spectateGame(data, user.id, client);
        }
    }
}