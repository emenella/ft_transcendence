import { Inject, Logger, forwardRef } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer, ConnectedSocket, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./Socket.service";
import { User } from "../User/entity/User.entity";
import { UserService } from "../User/service/User.service";
import { UserStatus } from "../User/service/User.service";
import { AuthService } from "../Auth/Auth.service";
import { GameService } from "../Game/Game.service";
import { MatchmakingService } from "../Game/Matchmaking/Matchmaking.service";

export enum SockEvent
{
    SE_MM_LEAVE = 'mm:leave',
    SE_MM_JOIN = 'mm:join',
	SE_GM_EVENT = 'gm:event',
	SE_GM_JOIN = 'gm:join',
	SE_GM_SEARCH = 'gm:search',
	SE_GM_LEAVE = 'gm:leave',
	SE_GM_READY = 'gm:ready',
	SE_GM_INFO = 'gm:info',
	SE_GM_SPEC = 'gm:spec',
	SE_CH_MSG = 'ch:msg',
	SE_CH_JOIN = 'ch:join',
	SE_CH_LEAVE = 'ch:leave',
	SE_CH_CREATE = 'ch:create',
}

@WebSocketGateway(81, {namespace: "user", cors: true})
export class SocketGateway {
	
	private logger: Logger = new Logger("SocketGateway");

	@WebSocketServer()
	server: Server;

	constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,
				@Inject(forwardRef(() => AuthService)) private authService: AuthService,
				@Inject(forwardRef(() => GameService)) private gameService: GameService,
				@Inject(forwardRef(() => MatchmakingService)) private matchmakingService: MatchmakingService,
				@Inject(forwardRef(() => SocketService)) private socketService: SocketService) {}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			this.socketService.addUser(client, user)
			if (this.gameService.findGamesIdWithPlayer(user.id).length)
				this.userService.changeStatus(user, UserStatus.InGame);
			else
				this.userService.changeStatus(user, UserStatus.Connected);
			this.logger.log(`Client connected: ${user.username}`);
		}
		else {
			client.disconnect();
		}
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			this.socketService.removeUser(client);
			this.userService.changeStatus(user, UserStatus.Disconnected);
			this.logger.log(`Client disconnected: ${user.username}`);
		}
		client.disconnect();
	}

	async authentificate(client: Socket): Promise<User | null> {
		let user;
		if (client.handshake.headers.authorization) {
			try {
				const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
				user = await this.userService.getUserByConnectionId(payload.connectionId);
			} catch (e) {
				console.log(e);
			}
		}
		return (user ? user : null);
	}

    @SubscribeMessage("duelRequestSent")
    async duelRequestSent(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const sender: User | null = await this.authentificate(client);
        const receiverSocket : Socket = this.socketService.getSocketByUserId(data.receiverId);
        if (sender && receiverSocket !== undefined) {
            receiverSocket.emit("duelRequestReceived", sender);
        }
    }

    @SubscribeMessage("duelRequestAccepted")
    async duelRequestAccepted(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const receiver: User | null = await this.authentificate(client);
        const sender = await this.userService.getUserById(data.senderId);
        const senderSocket = this.socketService.getSocketByUserId(data.senderId);
        if (receiver && sender && senderSocket) {
            if (!this.gameService.findGamesIdWithPlayer(receiver.id).length
            && !this.gameService.findGamesIdWithPlayer(sender.id).length)
            {
                await this.matchmakingService.createGame(sender, receiver);
                client.emit("duelLaunched");
                senderSocket.emit("duelLaunched");

            }
        }
    }
}
