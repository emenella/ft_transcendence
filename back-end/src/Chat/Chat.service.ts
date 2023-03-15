import { Injectable } from "@nestjs/common";
import { Socket, Server } from 'socket.io'
import { User } from "../Users/entity/User.entity";
import { UserService } from "../Users/service/User.service";
import { ChatUser } from "./Dto/chatDto";
import { AuthenticationService } from "../Auth/Authenfication.service";
import { Chan } from "./Chan/Chan.entity";
import { ChanService } from "./Chan/Chan.service";

@Injectable()
export class ChatService {

    private chatUsers : ChatUser[];

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private chanService: ChanService
    ) {}

    async connectUserFromSocket(socket: Socket): Promise<ChatUser | undefined> {
        const connection: any = await this.authService.verifyJWT(socket.handshake.auth.token);

		if (connection === null || connection === undefined)
			return (undefined);

		const user : User = await this.userService.getUserFromConnectionId(connection.id);

        if (user === null || user === undefined)
		{
			socket.disconnect();
			return (undefined);
		}

		let idx = this.chatUsers.push({
			socket: socket,
			username: await this.getUsernameFromID(user.id),
			id: user.id
		})

		return this.chatUsers[idx - 1];
	}

    async getUserFromSocket(socket: Socket): Promise<ChatUser | undefined> {
        const connection: any = await this.authService.verifyJWT(socket.handshake.auth.token);

		if (connection === null || connection === undefined)
			return (undefined);

		const user : User = await this.userService.getUserFromConnectionId(connection.id);

        if (user === null || user === undefined)
		{
			socket.disconnect();
			return (undefined);
		}

		let ret = this.chatUsers.find((u) => { return u.id === user.id})
		return (ret);
    }

	async getUsernameFromID(userId : number) : Promise<string> {
		let ret = await this.userService.getUserById(userId);

		if (ret === undefined)
			return "undefined";

		return ret.username;
	}

	getUserFromID(userId : number) : ChatUser | undefined {
        return (this.chatUsers.find((u) => { return u.id === userId}));

	}

    getUserFromUsername(username: string): ChatUser | undefined {
        return (this.chatUsers.find((u) => { return u.username === username}));
    }

    removeUser(refId: number) {
		this.chatUsers.splice(this.chatUsers.findIndex((u) => { return u.id === refId}), 1);
	}

    async disconnectClient(socket: Socket): Promise<undefined> {
		const connection: any = await this.authService.verifyJWT(socket.handshake.auth.token);

		if (connection === null || connection === undefined)
			return (undefined);

		const user : User = await this.userService.getUserFromConnectionId(connection.id);

        if (user === null || user === undefined)
		{
			socket.disconnect();
			return (undefined);
		}

    	this.removeUser(user.id);
	}

    async handleCommand(server: Server, socket: Socket, user: ChatUser, chan: Chan, msg: string) : Promise<Boolean> {
        const command: string[] = msg.split(" ");
        const isAdm: boolean = await this.chanService.isAdmin(chan.id, user.id);

        switch (command[0]) {
            case "/invite" : {
                if (isAdm === false) {
                    socket.emit('error', 'Only admin or owner can send command !');
                    return true;
                }
                if (command.length != 2) {
                    socket.emit('error', 'invite command need exactly one argument : /invite <Username>.');
                    return true;
                }

                const invitedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (invitedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }
                const ret : Chan | string = await this.chanService.inviteUser(chan.id, user.id, invitedUser.id);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }

                invitedUser.socket.emit('invited', ret.title);
                return true;
            } 
            case "/ban" : {
                if (isAdm === false) {
                    socket.emit('error', 'Only admin or owner can send command !');
                    return true;
                }
                if (command.length != 3) {
                    socket.emit('error', 'ban command need exactly two argument : /ban <Username> <Duration(minute)>.');
                    return true;
                }

                const bannedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (bannedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }
                const duration : number = parseInt(command[2]);
                if (duration <= 0) {
                    socket.emit('error', 'ban duration is 1 minute minimum');
                    return true;
                }

                const hours = new Date(0);
                hours.setHours(0, duration);
                const expires_in = new Date(Date.now() + hours.getTime());

                const ret : Chan | string = await this.chanService.banUser(chan.id, user.id, bannedUser.id, expires_in);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }
                server.to(ret.id.toString()).emit('msgToClient', {author: user.username, chan: chan.title, msg: bannedUser.username + ' has been banned !'});
                socket.leave(ret.id.toString());
                socket.emit('error', 'You have been ban from ' + ret.title + ' channel.\nPay attention to your behavior next time !');
                socket.emit('ban', ret.title);
                return true;
            }
            case "/mute" : {
                if (isAdm === false) {
                    socket.emit('error', 'Only admin or owner can send command !');
                    return true;
                }
                if (command.length != 3) {
                    socket.emit('error', 'mute command need exactly two argument : /mute <Username> <Duration(minute)>.');
                    return true;
                }

                const mutedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (mutedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }
                const duration : number = parseInt(command[2]);
                if (duration <= 0) {
                    socket.emit('error', 'ban duration is 1 minute minimum');
                    return true;
                }

                const hours = new Date(0);
                hours.setHours(0, duration);
                const expires_in = new Date(Date.now() + hours.getTime());

                const ret : boolean | string = await this.chanService.chanMute(chan.id, user.id, mutedUser.id, expires_in);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }
                server.to(chan.id.toString()).emit('msgToClient', {author: user.username, chan: chan.title, msg: mutedUser.username + ' has been muted !'});
                socket.emit('error', 'You have been mute in ' + chan.title + ' channel.\nBe carefull not to be banned !');
                return true;
            }
            case "/promote" : {
                return true;
            }
            case "/demote" : {
                return true;
            }
            case "/password" : {
                return true;
            }
            default : {
                return false;
            }
        }
    }
}