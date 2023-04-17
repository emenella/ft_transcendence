import {WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { AuthenticationService } from '../../Auth/Authenfication.service';
import { UserService } from '../../User/service/User.service';
import { MatchmakingService} from './Matchmaking.service';
import { User } from '../../User/entity/User.entity';

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
        this.matchmakingService.addSocket(user, client);
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
        this.matchmakingService.removeSocket(user);
    }

    @SubscribeMessage('matchmaking:join')
    async joinQueue(@ConnectedSocket() client: Socket)
    {
        const user = await this.authentificate(client);
        if (user)
        {
            await this.matchmakingService.joinQueue(user);
        }
    }

    @SubscribeMessage('matchmaking:leave')
    async leaveQueue(@ConnectedSocket() client: Socket)
    {
       const user = await this.authentificate(client);
        if (user)
        {
            this.matchmakingService.leaveQueue(user);
        }
    }

    async authentificate(client: Socket): Promise<User> {
        if (client.handshake.headers.authorization) {
            const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
            let user = await this.userService.getUserByConnectionId(payload.connectionId);
            if (user) {
                return user;
            }
        }
        client.disconnect();
        throw new Error('Unauthorized');
    }
}