import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io'
import { User } from "../Users/entity/User.entity";
import { UserService } from "../Users/service/User.service";
import { ChatUser } from "./Dto/chatDto";
import { AuthenticationService } from "../Auth/Authenfication.service";

@Injectable()
export class ChatService {

    private chatUsers : ChatUser[];

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
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
}