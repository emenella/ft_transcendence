import {WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { AuthenticationService } from '../../Auth/Authenfication.service';
import { UserService } from '../../Users/service/User.service';
import { MatchmakingService} from './Matchmaking.service';
import { User } from '../../Users/entity/User.entity';

@WebSocketGateway(81, { namespace: 'matchmaking', cors: true})
export class MatchmakingGateway{
    @WebSocketServer()
    server: Server;

    constructor(private readonly matchmakingService: MatchmakingService,
        private readonly authService: AuthenticationService,
        private readonly userService: UserService)
    {}

    async handleConnection(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (!user)
        {
            client.disconnect()
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.leaveQueue(user);
        }
        client.disconnect();
    }

    @SubscribeMessage('matchmaking:join')
    async joinQueue(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.joinQueue(user, client);
            this.server.emit('matchmaking:join', user.id);
        }
    }

    @SubscribeMessage('matchmaking:leave')
    async leaveQueue(@ConnectedSocket() client: Socket)
    {
       const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.leaveQueue(user);
            this.server.emit('matchmaking:leave', user.id);
        }
    }

    async authentificate(client: Socket): Promise<User> {
        if (client.handshake.headers.authorization) {
            const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
            let user = await this.userService.getUserFromConnectionId(payload.connectionId);
            if (user) {
                return user;
            }
        }
        client.disconnect();
        throw new Error('Unauthorized');
    }
}