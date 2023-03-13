import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io'
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

    async handleCommand(socket: Socket, user: ChatUser, chan: Chan, msg: string) : Promise<Boolean> {
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
                return true;
            }
            case "/mute" : {
                if (isAdm === false) {
                    socket.emit('error', 'Only admin or owner can send command !');
                    return true;
                }
                return true;
            }
            default : {
                return false;
            }
        }
    }
}