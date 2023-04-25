import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameService} from './Game.service';
import { AuthService } from '../Auth/Auth.service';
import { UserService } from '../User/service/User.service';
import { User } from '../User/entity/User.entity';
import { SockEvent } from '../Socket/Socket.gateway';


@WebSocketGateway(81, {namespace: 'game', cors: true})
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService, private readonly authService: AuthService, private readonly userService: UserService) {}

    afterInit() {
    }

    async handleConnection(@ConnectedSocket() client: Socket) {
        const user = await this.authentificate(client);
        if (!user) {
            client.disconnect();
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        const user = await this.authentificate(client);
        if (user) {
            const ret = this.gameService.isPlayer(client);
            if (ret) {
                if (ret.isPlayer) {
                    this.gameService.leavePlayer(user.id);
                } else {
                    this.gameService.leaveSpectator(user.id);
                }
            }
        }
        client.disconnect();
    }

    @SubscribeMessage(SockEvent.SE_GM_EVENT)
    async onGameEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            this.gameService.handleGameEvent(user.id, data);
        }
    }

    @SubscribeMessage(SockEvent.SE_GM_JOIN)
    async onGameJoin(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            this.gameService.joinPlayer(data, user.id, client);
        }
    }

    @SubscribeMessage(SockEvent.SE_GM_SEARCH)
    async onGameSearch(@ConnectedSocket() client: Socket): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            const games = this.gameService.findGamesIdWithPlayer(user.id);
            client.emit(SockEvent.SE_GM_SEARCH, games);
        }
    }

    @SubscribeMessage(SockEvent.SE_GM_LEAVE)
    async onGameLeave(@ConnectedSocket() client: Socket): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            this.gameService.leavePlayer(user.id);
        }
    }

    @SubscribeMessage(SockEvent.SE_GM_READY)
    async onGameReady(client: Socket): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            this.gameService.setPlayerReady(user.id);
        }
    }

    @SubscribeMessage(SockEvent.SE_GM_INFO)
    async onGameInfo(@ConnectedSocket() client: Socket): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            let game = this.gameService.getGameInfo(user.id);
            client.emit(SockEvent.SE_GM_INFO, game);
        }
    }

    @SubscribeMessage(SockEvent.SE_GM_SPEC)
    async onGameSpec(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
        const user = await this.authentificate(client);
        if (user) {
            this.gameService.spectateGame(data, user.id, client);
        }
    }

    async authentificate(client: Socket): Promise<User | null> {
        if (client.handshake.headers.authorization) {
            try {
                const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
                let user = await this.userService.getUserByConnectionId(payload.connectionId);
                if (user) {
                    return user;
                }
            } catch (e) {
                client.disconnect();
                return null;
            }
        }
        client.disconnect();
        return null;
        
    }
}