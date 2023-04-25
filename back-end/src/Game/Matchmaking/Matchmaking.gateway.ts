import {WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { AuthService } from '../../Auth/Auth.service';
import { UserService } from '../../User/service/User.service';
import { MatchmakingService} from './Matchmaking.service';
import { User } from '../../User/entity/User.entity';
import { SockEvent } from '../../Socket/Socket.gateway';

@WebSocketGateway(81, { namespace: 'matchmaking', cors: true})
export class MatchmakingGateway{
    @WebSocketServer()
    server: Server;

    constructor(private readonly matchmakingService: MatchmakingService,
        private readonly authService: AuthService,
        private readonly userService: UserService)
    {}

    async handleConnection(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.addSocket(user, client);
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.leaveQueue(user);
            this.matchmakingService.removeSocket(user);
        }
        client.disconnect();
    }

    @SubscribeMessage(SockEvent.SE_MM_JOIN)
    async joinQueue(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (user)
        {
            await this.matchmakingService.joinQueue(user);
        }
    }

    @SubscribeMessage(SockEvent.SE_MM_LEAVE)
    async leaveQueue(@ConnectedSocket() client: Socket)
    {
       const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.leaveQueue(user);
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