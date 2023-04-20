import { Inject, forwardRef } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SubscribeMessage } from '@nestjs/websockets';
import { AuthenticationService } from '../Auth/Authenfication.service';
import { UserService } from '../User/service/User.service';
import { User } from '../User/entity/User.entity';
import { UserStatus } from '../User/service/User.service';

@WebSocketGateway(81, {namespace: 'user', cors: true})
export class UserGateway {
	@WebSocketServer()
	server: Server;

	constructor(@Inject(forwardRef(() => AuthenticationService)) private authService: AuthenticationService,
				private readonly userService: UserService) {}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			user.socket = client;
			this.userService.changeStatus(user, UserStatus.Connected);
		}
		else {
			client.disconnect();
		}
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			user.socket = null;
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

	@SubscribeMessage('friendStatusChange')
	async onFriendStatusChange(@ConnectedSocket() client: Socket, status: number) {
        const user: User | null = await this.authentificate(client);
		if (user) {
			this.userService.changeStatus(user, status);
			console.log("PUTAIN");
			user.friends.forEach(friend => {
				if (friend.socket) {
					console.log(friend.username)
					friend.socket.emit('friendStatusChanged');			
				}
			});
		}
	}
}
