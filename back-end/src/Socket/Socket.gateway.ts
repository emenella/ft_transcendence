import { Inject, Logger, forwardRef, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer, ConnectedSocket, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./Socket.service";
import { User } from "../User/entity/User.entity";
import { UserService } from "../User/service/User.service";
import { UserStatus } from "../User/service/User.service";
import { AuthService } from "../Auth/Auth.service";
import { GameService } from "../Game/Game.service";
import { MatchmakingService } from "../Game/Matchmaking/Matchmaking.service";
import { ChatService, msg } from "src/Chat/Chat.service";
import { MessageService } from "src/Chat/Message/Message.service";
import { ChanService } from "src/Chat/Chan/Chan.service";
import { ChatUser } from "src/Chat/Dto/chatDto";
import { Chan } from "src/Chat/Chan/Chan.entity";
import { Message } from "src/Chat/Message/Message.entity";
import { WsThrottlerGuard } from "./utils/ThrottlerGuard"

export enum SockEvent {
	SE_UPDATE_FRONT = 'updateFront',
	//~~ Matchmaking
	SE_MM_LEAVE = 'mm:leave',
	SE_MM_JOIN = 'mm:join',
	SE_MM_FOUND = 'mm:foundMatch',
	//~~ Game
	SE_GM_EVENT = 'gm:event',
	SE_GM_JOIN = 'gm:join',
	SE_GM_SEARCH = 'gm:search',
	SE_GM_LEAVE = 'gm:leave',
	SE_GM_READY = 'gm:ready',
	SE_GM_UNREADY = 'gm:unready',
	SE_GM_INFO = 'gm:info',
	SE_GM_FINISH = 'gm:finish',
	SE_GM_LIVE = 'gm:live',
	SE_GM_SPEC = 'gm:spec',
	SE_GM_DUEL_SEND = 'gm:duelSend',
	SE_GM_DUEL_SUCCESS = 'gm:duelSendTrue',
	SE_GM_DUEL_FAILURE = 'gm:duelSendFalse',
	SE_GM_DUEL_RECEIVE = 'gm:duelReceive',
	SE_GM_DUEL_ACCEPT = 'gm:duelAccept',
	SE_GM_DUEL_DENY = 'gm:duelDeny',
	SE_GM_DUEL_DENIED = 'gm:duelDenied',
	SE_GM_DUEL_LAUNCH = 'gm:duelLaunch',
	//~~ Chat
	SE_CH_MSG = 'ch:msg',
	SE_CH_JOIN = 'ch:join',
	SE_CH_LEAVE = 'ch:leave',
	SE_CH_CREATE = 'ch:create',
	//~~ User
	SE_US_STATUS = 'us:status'
}

@UseGuards(WsThrottlerGuard)
@WebSocketGateway(81, { cors: true, maxHttpBufferSize: 1e8 })
export class SocketGateway {

	private logger: Logger = new Logger("SocketGateway");

	@WebSocketServer()
	server: Server;

	constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,
		@Inject(forwardRef(() => AuthService)) private authService: AuthService,
		@Inject(forwardRef(() => GameService)) private gameService: GameService,
		@Inject(forwardRef(() => MatchmakingService)) private matchmakingService: MatchmakingService,
		@Inject(forwardRef(() => SocketService)) private socketService: SocketService,
		@Inject(forwardRef(() => ChatService)) private chatService: ChatService,
		@Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
		@Inject(forwardRef(() => ChanService)) private readonly chanService: ChanService) { }

	async afterInit() {
		this.chatService.afterInit();
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const user = await this.authentificate(client);
		if (user) {
			this.socketService.addUser(client, user)
			if (this.gameService.findGamesIdWithPlayer(user.id).length)
				this.userService.changeStatus(user, UserStatus.InGame);
			else
				this.userService.changeStatus(user, UserStatus.Connected);
			this.chatService.handleConnection(client);
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
			const ret = this.gameService.isPlayer(client);
			if (ret && ret.isPlayer)
				this.gameService.leavePlayer(user.id);
		}
		this.chatService.handleDisconnect(client);
		client.disconnect();
	}

	async authentificate(client: Socket): Promise<User | null> {
		let user;
		if (client.handshake.headers.authorization) {
			try {
				const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization).catch((err) => { throw new HttpException(err || "Invalid token" , 401); });
				if (!payload.otp) {
					throw new HttpException("OTP required", HttpStatus.UNAUTHORIZED);
				}
				user = await this.userService.getUserByConnectionId(payload.connectionId);
			} catch (e) {
				this.logger.log(`Client auth failed: ${user?.username}`);
			}
		}
		return (user ? user : null);
	}

	//~~~~~~~~~~~~~~~~~~~~ DUEL ~~~~~~~~~~~~~~~~~~~~\\

	@SubscribeMessage(SockEvent.SE_GM_DUEL_SEND)
	async duelRequestSend(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const sender: User | null = await this.authentificate(client);
		const receiver: User | null = await this.userService.getUserById(data.receiverId);
		const receiverSocket = await this.socketService.getUserById(data.receiverId).then((user: User) => { return user.socket; });
		if (receiver.blacklist.some((f) => { return f.id === sender.id }))
			client.emit(SockEvent.SE_GM_DUEL_FAILURE, "L'utilisateur vous a bloqué.");
		else if (sender.blacklist.some((f) => { return f.id === receiver.id }))
			client.emit(SockEvent.SE_GM_DUEL_FAILURE, "Utilisateur bloqué.");
		else if (this.gameService.findGamesIdWithPlayer(sender.id).length)
			client.emit(SockEvent.SE_GM_DUEL_FAILURE, "Vous êtes déjà en partie.");
		else if (this.gameService.findGamesIdWithPlayer(receiver.id).length)
			client.emit(SockEvent.SE_GM_DUEL_FAILURE, "Utilisateur déjà en partie.");
			else if (sender && receiverSocket) {
			receiverSocket.emit(SockEvent.SE_GM_DUEL_RECEIVE, sender);
			client.emit(SockEvent.SE_GM_DUEL_SUCCESS);
		}
		else
			client.emit(SockEvent.SE_GM_DUEL_FAILURE, "L'utilisateur est déconnecté.");
	}

	@SubscribeMessage(SockEvent.SE_GM_DUEL_ACCEPT)
	async duelRequestAccept(@ConnectedSocket() client: Socket, @MessageBody() sender: User) {
		const receiver: User | null = await this.authentificate(client);
		const senderSocket = await this.socketService.getUserById(sender.id).then((user: User) => { return user.socket; });
		try {
			if (receiver && sender && senderSocket && receiver.id != sender.id ) {
				if (!this.gameService.findGamesIdWithPlayer(receiver.id).length
				&& !this.gameService.findGamesIdWithPlayer(sender.id).length) {
					this.matchmakingService.createGame(sender, receiver).catch((e) => { console.log(e); })
					.then((game) => 
					{ client.emit(SockEvent.SE_GM_DUEL_LAUNCH);
						senderSocket.emit(SockEvent.SE_GM_DUEL_LAUNCH);
					});
				}
			}
		} catch (e) { console.log(e); }
	}

	@SubscribeMessage(SockEvent.SE_GM_DUEL_DENY)
	async duelDeny(@ConnectedSocket() client: Socket, @MessageBody() sender: User) {
		const receiver: User | null = await this.authentificate(client);
		const senderSocket = await this.socketService.getUserById(sender.id).then((user: User) => { return user.socket; });
		if (receiver && sender && senderSocket) {
			senderSocket.emit(SockEvent.SE_GM_DUEL_DENIED);
		}
	}

	//~~~~~~~~~~~~~~~~~~~~ GAME ~~~~~~~~~~~~~~~~~~~~\\

	@SubscribeMessage(SockEvent.SE_GM_EVENT)
	async onGameEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string): Promise<any> {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			this.gameService.handleGameEvent(user.id, data);
		}
	}

	@SubscribeMessage(SockEvent.SE_GM_JOIN)
	async onGameJoin(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			this.gameService.joinPlayer(data, user.id, client);
		}
	}

	@SubscribeMessage(SockEvent.SE_GM_SEARCH)
	async onGameSearch(@ConnectedSocket() client: Socket): Promise<any> {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			const games = this.gameService.findGamesIdWithPlayer(user.id);
			client.emit(SockEvent.SE_GM_SEARCH, games);
		}
	}

	@SubscribeMessage(SockEvent.SE_GM_LEAVE)
	async onGameLeave(@ConnectedSocket() client: Socket): Promise<any> {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			this.gameService.leavePlayer(user.id);
		}
	}

	@SubscribeMessage(SockEvent.SE_GM_READY)
	async onGameReady(client: Socket): Promise<any> {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			this.gameService.setPlayerReady(user.id);
		}
	}

	@SubscribeMessage(SockEvent.SE_GM_INFO)
	async onGameInfo(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			this.gameService.interpolatePosition(user, data);
		}
	}

	@SubscribeMessage(SockEvent.SE_MM_JOIN)
	async joinQueue(@ConnectedSocket() client: Socket) {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			await this.matchmakingService.joinQueue(user);
		}
	}

	@SubscribeMessage(SockEvent.SE_MM_LEAVE)
	async leaveQueue(@ConnectedSocket() client: Socket) {
		const user = await this.socketService.getUserBySocketId(client.id);
		if (user) {
			this.matchmakingService.leaveQueue(user);
		}
	}

	//~~~~~~~~~~~~~~~~~~~~ CHAT ~~~~~~~~~~~~~~~~~~~~\\

	@SubscribeMessage('msgToServer')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { chan: string, msg: string }): Promise<void> {
		const user: ChatUser | undefined = await this.chatService.getUserFromSocket(client);

		if (data.msg.length > 4096)
		{
			client.emit('error', 'La taille du message ne doit pas excéder 4096 caractères.');
			return ;
		}

		if (user !== undefined) {
			if (data.chan[0] !== '#') {
				let user1 = await this.userService.getUserById(user.id);
				let user2;
				try {
					user2 = await this.userService.getUserById((await this.userService.getUserByUsername(data.chan)).id as number);
				
				} catch (e) { client.emit('error', 'No such DM'); };
				const dmChan: Chan | undefined = await this.chanService.getDm(user1, user2);
				if (dmChan !== undefined) {
					let ret = await this.messageService.createMessage(await this.userService.getUserById(user.id), user.username, dmChan, data.msg);
					let hour: number = (ret.date.getUTCHours() >= 22 ? ret.date.getUTCHours() - 22 : ret.date.getUTCHours() + 2);
					let minute: string | number = (ret.date.getMinutes() >= 10 ? ret.date.getMinutes() : "0" + ret.date.getMinutes());
					let month: string | number = (ret.date.getMonth() + 1 >= 10 ? (ret.date.getMonth() + 1) : "0" + (ret.date.getMonth() + 1))

					let newMessage: any = {
						date: "(" + ret.date.getDate() + "/" + month + ") " + hour + ":" + minute,
						authorId: ret.authorId,
						author: ret.authorName,
						chan: data.chan,
						msg: ret.content
					};
					newMessage.chan = user2.username;
					client.emit('msgToClient', newMessage);
					newMessage.chan = user.username;
					this.socketService.getSocketByUserId(user2.id).emit('msgToClient', newMessage);
					return;
				}
				client.emit('error', 'No such DM');
				return;
			}

			const chan: Chan | undefined = await this.chanService.getChanByTitle(data.chan);

			if (chan !== undefined) {
				if (await this.chanService.isInChan(chan, user.id) === false) {
					client.emit('error', 'Not in channel !');
					return;
				} else if (await this.chanService.isMute(chan.id, user.id) === true) {
					client.emit('error', 'Muted in this chan !');
					return;
				}
				if (await this.chatService.handleCommand(this.server, client, user, chan, data.msg) === true) {
					return;
				}

				let ret = await this.messageService.createMessage(await this.userService.getUserById(user.id), user.username, chan, data.msg);
				let hour: number = (ret.date.getUTCHours() >= 22 ? ret.date.getUTCHours() - 22 : ret.date.getUTCHours() + 2);
				let minute: string | number = (ret.date.getMinutes() >= 10 ? ret.date.getMinutes() : "0" + ret.date.getMinutes());
				let month: string | number = (ret.date.getMonth() + 1 >= 10 ? (ret.date.getMonth() + 1) : "0" + (ret.date.getMonth() + 1))

				let newMessage: any = {
					date: "(" + ret.date.getDate() + "/" + month + ") " + hour + ":" + minute,
					authorId: ret.authorId,
					author: ret.authorName,
					chan: chan.title,
					msg: ret.content
				};
				if (chan.ownerId === user.id) {
					newMessage.author = '[owner] ' + user.username;
				}
				else if (await this.chanService.isAdmin(chan.id, user.id) === true) {
					newMessage.author = '[admin] ' + user.username;
				}
				else {
					newMessage.author = user.username;
				}
				this.server.to(chan.id.toString()).emit('msgToClient', newMessage);
				return;
			}
			client.emit('error', 'No such channel !');
			return;
		}
	}

	@SubscribeMessage('joinChan')
	async handleJoinChan(@ConnectedSocket() client: Socket, @MessageBody() data: { chan: string, password: string | null }) {
		const user: ChatUser | undefined = await this.chatService.getUserFromSocket(client);

		if (user !== undefined) {
			if (data.password === "") {
				data.password = null;
			}
			let ret: Chan | string = await this.chanService.joinChanByTitle(data.chan, await this.userService.getUserById(user.id), data.password);

			if (typeof ret === 'string') {
				client.emit('error', ret);
				return;
			}

			const messages: Message[] = await this.messageService.getMessagesFromChanTitle(data.chan);
			let sendList: msg[] = [];

			messages.forEach((message) => {
				let hour: number = (message.date.getUTCHours() >= 22 ? message.date.getUTCHours() - 22 : message.date.getUTCHours() + 2);
				let minute: string | number = (message.date.getMinutes() >= 10 ? message.date.getMinutes() : "0" + message.date.getMinutes());
				let month: string | number = (message.date.getMonth() + 1 >= 10 ? (message.date.getMonth() + 1) : "0" + (message.date.getMonth() + 1))

				let newMessage: msg = {
					date: "(" + message.date.getDate() + "/" + month + ") " + hour + ":" + minute,
					authorId: message.authorId,
					author: message.authorName,
					content: message.content
				};
				sendList.push(newMessage);
			})

			let joinData: { chan: string, messages: msg[] } = { chan: data.chan, messages: sendList };

			client.join(ret.id.toString());
			client.emit('joinedChan', joinData);
		}
	}

	@SubscribeMessage('leaveChan')
	async handleLeaveChan(@ConnectedSocket() client: Socket, @MessageBody() chan: string) {
		const user: ChatUser | undefined = await this.chatService.getUserFromSocket(client);

		if (user !== undefined) {
			const chanToLeave: Chan | undefined = await this.chanService.getChanByTitle(chan);

			if (chanToLeave !== undefined) {
				const ret: string | number | undefined = await this.chanService.leaveChanById(chanToLeave.id, user.id);

				if (typeof ret === 'string') {
					client.emit('error', ret);
					return;
				}
				if (ret === undefined && chanToLeave.isPrivate === false) {
					this.chatService.spliceChans(this.chatService.findIndexChans((c) => { return c === chanToLeave.title }), 1);
					this.server.emit('listOfChan', this.chatService.getChans());
				}
				else if (ret !== undefined) {
					this.server.to(chanToLeave.id.toString()).emit('msgToClient', { author: user.username, chan: chanToLeave.title, msg: ' leaved the channel !' });
				}

				client.leave(chanToLeave.id.toString());
				client.emit('leftChan', chan);
			}
		}
	}

	@SubscribeMessage('createChan')
	async handleCreateChan(@ConnectedSocket() client: Socket, @MessageBody() data: { title: string, isPrivate: boolean, password: string | undefined }) {
		const user: ChatUser | undefined = await this.chatService.getUserFromSocket(client);

		if (user !== undefined) {
			if (data.password === "") {
				data.password = undefined;
			}

			let ret: Chan | string = await this.chanService.createChan(data.title, await this.userService.getUserById(user.id), data.isPrivate, data.password !== undefined,
				data.password, false, await this.userService.getUserById(user.id));

			if (typeof ret === 'string') {
				client.emit('error', ret);
				return;
			}

			if (ret.isPrivate === false) {
				this.chatService.pushChans(ret.title);
				this.server.emit('listOfChan', this.chatService.getChans());
			}
			client.join(ret.id.toString());
			client.emit('createdChan', ret.title);
		}

	}
}
