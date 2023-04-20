import { Inject, forwardRef } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../User/entity/User.entity';
import { UserService } from '../User/service/User.service';
import { UserStatus } from '../User/service/User.service';
import { AuthService } from '../Auth/Auth.service';
import { SocketService } from './Socket.service';

@WebSocketGateway(81, {namespace: 'user', cors: true})
export class SocketGateway {
	
	@WebSocketServer()
	server: Server;

	constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,
				@Inject(forwardRef(() => AuthService)) private authService: AuthService,
				@Inject(forwardRef(() => SocketService)) private socketService: SocketService) {}

	async afterInit() {
		console.log("Socket Initialized.")
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			this.socketService.addUser(client, user)
			this.userService.changeStatus(user, UserStatus.Connected);
		}
		else {
			client.disconnect();
		}
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			this.socketService.removeUser(client, user);
			this.userService.changeStatus(user, UserStatus.Disconnected);
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

	// @SubscribeMessage('friendStatusChange')
	// async onFriendStatusChange(@ConnectedSocket() client: Socket, status: number) {
    //     const user: User | null = await this.authentificate(client);
	// 	if (user) {
	// 		this.userService.changeStatus(user, status);
	// 	}
	// }
}
