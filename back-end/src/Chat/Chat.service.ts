import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io'
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chan, RelationTable } from "./Chan/Chan.entity";
import { ChanPasswordService } from "./Chan/Chan.password.service";
import { User } from "src/Users/entity/User.entity";
import { ChanListDTO, UserListDto, ELevelInChan } from './Dto/chanDto';
import { UserService } from "src/Users/service/User.service";
import { ELevel, NoticeDTO } from "./Dto/notificationDto";
import { ChatUser, UserDataDto, CreateChanDto, ChanJoinedDTO } from "./Dto/chatDto";
import { ChanService } from "./Chan/Chan.service";
import { MessageService } from "./Message/Message.service";
import { AuthenticationService } from "src/Auth/Authenfication.service";

@Injectable()
export class ChatService {

    private chatUsers : ChatUser[];

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private chanService: ChanService,
        private messageService: MessageService
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

    async createChan(socket: Socket, user: ChatUser, data: CreateChanDto)
    {
        const user1 = await this.userService.getUserById(user.id);
        const user2 = await this.userService.getUserById(data.with);
        if (data.isDm === true && (user2 === null || user2 === undefined))
            return ;

        const chan = await this.chanService.createChan(data.title, user1, data.isPrivate, data.isProtected,
                                                        data.password, data.isDm, user2);
        if (chan instanceof Chan)
        {
            let chanJoinedDto : ChanJoinedDTO;

            chanJoinedDto = {
                id: 				chan.id,
	            title:				(chan.isDm === false) ? chan.title : user2.username,
	            private:			chan.isPrivate,
	            protected:			chan.isProtected,
	            level:				(chan.isDm === false) ? await this.chanService.getUserLevel(chan.id, chan.owner.id, user1.id) : ELevelInChan.casual,
	            isDm:				chan.isDm,
	            owner:				(chan.isDm === false) ? chan.owner.id : user2.id
            }

            user.socket.join(chan.id.toString());
            user.socket.emit("JOINED_ROOM", chanJoinedDto);

            if (chan.isDm === true)
            {
                const userDm = this.getUserFromID(user2.id);

                chanJoinedDto.title = user1.username;
                chanJoinedDto.owner = user1.id;

                userDm.socket.join(chan.id.toString());
                userDm.socket.emit("JOINED_ROOM", chanJoinedDto);
            }
            else
            {
                let nDto : NoticeDTO;
                nDto = {level: ELevel.info, content: "Chan " + chan.title + " has been created." };
                socket.emit("NOTIFICATION", nDto);
            }
        }
        else
        {
            let nDto : NoticeDTO;
            nDto = {level: ELevel.error, content: "Can not create chan : " + data.title};
            socket.emit("NOTIFICATION", nDto);
        }
    }
}