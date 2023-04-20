import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Socket, Server } from 'socket.io'
import { User } from "../User/entity/User.entity";
import { UserService } from "../User/service/User.service";
import { ChatUser } from "./Dto/chatDto";
import { AuthService } from "../Auth/Auth.service";
import { Chan } from "./Chan/Chan.entity";
import { ChanService } from "./Chan/Chan.service";

@Injectable()
export class ChatService {

    private chatUsers : ChatUser[] = [];

    constructor(
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        private chanService: ChanService
    ) {}

    async connectUserFromSocket(socket: Socket): Promise<ChatUser | undefined> {
        if (socket.handshake.headers.authorization) {
            try {
                const connection: any = await this.authService.verifyJWT(socket.handshake.headers.authorization);
                
                if (connection === null || connection === undefined)
                return (undefined);
                
                const user : User = await this.userService.getUserByConnectionId(connection.connectionId);
                
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
            } catch (error) {
                socket.disconnect();
                return (undefined);
            }
        }
        else {
            socket.disconnect();
            return (undefined);
        }
	}

    async getUserFromSocket(socket: Socket): Promise<ChatUser | undefined> {
        if (socket.handshake.headers.authorization) {
            try {
                const connection: any = await this.authService.verifyJWT(socket.handshake.headers.authorization);
                
                if (connection === null || connection === undefined)
                return (undefined);
                
                const user : User = await this.userService.getUserByConnectionId(connection.connectionId);
                
                if (user === null || user === undefined)
                {
                    socket.disconnect();
                    return (undefined);
                }
                
                let ret = this.chatUsers.find((u) => { return u.id === user.id})
                return (ret);
            } catch (error) {
                socket.disconnect();
                return (undefined);
            }
        }
        else {
            socket.disconnect();
            return (undefined);
        }
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
        if (socket.handshake.headers.authorization) {
            try {
                const connection: any = await this.authService.verifyJWT(socket.handshake.headers.authorization);
                
                if (connection === null || connection === undefined)
                return (undefined);
                
                const user : User = await this.userService.getUserByConnectionId(connection.connectionId);
                
                if (user === null || user === undefined)
                {
                    socket.disconnect();
                    return (undefined);
                }
                
                this.removeUser(user.id);
                return;
            } catch (error) {
                socket.disconnect();
                return (undefined);
            }
        }
        else {
            socket.disconnect();
            return (undefined);
        }
	}

    async createDMChan(userId1: number, userId2: number) : Promise<boolean | string> {
        let user1 : User = await this.userService.getUserById(userId1);
        let user2 : User = await this.userService.getUserById(userId2);
        let chatUser1 : ChatUser | undefined = this.getUserFromID(userId1);
        let chatUser2 : ChatUser | undefined = this.getUserFromID(userId2);

        if (user1 === undefined || user2 === undefined) {
            return ("error user(s) doesn't exist !");
        }
        if (chatUser1 === undefined || chatUser2 === undefined) {
            return ("error user(s) not connected to Chat !");
        }
        let ret = await this.chanService.createChan("DMCHAN", user1, false, false, undefined, true, user2);
        if (typeof ret === 'string') {
            return ("error during DM creation : " + ret);
        }
        chatUser1.socket.join(ret.id.toString());
        chatUser1.socket.emit('createdChan', chatUser2.username);
        chatUser2.socket.join(ret.id.toString());
        chatUser2.socket.emit('createdChan', chatUser1.username);
        return (true);
    }

    async leaveDM(userId1: number, userId2: number) : Promise<boolean | string> {
        let user1 : User = await this.userService.getUserById(userId1);
        let user2 : User = await this.userService.getUserById(userId2);

        if (user1 === undefined || user2 === undefined) {
            return ("error user(s) doesn't exist !");
        }
        let ret = await this.chanService.getDm(user1, user2);
        if (ret === undefined) {
            return ("error no such DM");
        }
        return true;
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

                console.log(invitedUser);
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
                bannedUser.socket.leave(ret.id.toString());
                bannedUser.socket.emit('error', 'You have been ban from ' + ret.title + ' channel for ' + duration + ' min.\nPay attention to your behavior next time !');
                bannedUser.socket.emit('ban', ret.title);
                return true;
            }
            case "/unban" : {
                if (isAdm === false) {
                    socket.emit('error', 'Only admin or owner can send command !');
                    return true;
                }
                if (command.length != 2) {
                    socket.emit('error', 'ban command need exactly one argument : /unban <Username>.');
                    return true;
                }

                const unbannedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (unbannedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }

                const ret : Chan | string = await this.chanService.unbanUser(chan.id, user.id, unbannedUser.id);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }
                server.to(ret.id.toString()).emit('msgToClient', {author: user.username, chan: chan.title, msg: unbannedUser.username + ' has been unbanned !'});
                unbannedUser.socket.emit('error', 'You have been unban from ' + ret.title + ' channel.\nYou can join it again in join section !');
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
                    socket.emit('error', 'mute duration is 1 minute minimum');
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
                mutedUser.socket.emit('error', 'You have been mute in ' + chan.title + ' channel for ' + duration + ' min.\nBe carefull not to be banned !');
                return true;
            }
            case "/unmute" : {
                if (isAdm === false) {
                    socket.emit('error', 'Only admin or owner can send command !');
                    return true;
                }
                if (command.length != 2) {
                    socket.emit('error', 'unmute command need exactly one argument : /mute <Username>.');
                    return true;
                }

                const mutedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (mutedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }

                const ret : boolean | string = await this.chanService.chanUnmute(chan.id, user.id, mutedUser.id);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }
                server.to(chan.id.toString()).emit('msgToClient', {author: user.username, chan: chan.title, msg: mutedUser.username + ' has been unmuted !'});
                mutedUser.socket.emit('error', 'You have been unmute in ' + chan.title + ' channel !');
                return true;
            }
            case "/promote" : {
                if (user.id !== chan.ownerId) {
                    socket.emit('error', 'Only owner can send promote command !');
                    return true;
                }
                if (command.length != 2) {
                    socket.emit('error', 'promote command need exactly one argument : /promote <Username>.');
                    return true;
                }

                const promotedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (promotedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }
                const ret : undefined | string = await this.chanService.setIsAdmin(chan.id, user.id, promotedUser.id, true);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }
                server.to(chan.id.toString()).emit('msgToClient', {author: user.username, chan: chan.title, msg: promotedUser.username + ' is now an Admin !'})
                promotedUser.socket.emit('error', 'You have been promoted to admin in ' + chan.title + ' channel !\nRemember : With great power comes great responsabilities.');
                return true;
            }
            case "/demote" : {
                if (user.id !== chan.ownerId) {
                    socket.emit('error', 'Only owner can send demote command !');
                    return true;
                }
                if (command.length != 2) {
                    socket.emit('error', 'demote command need exactly one argument : /demote <Username>.');
                    return true;
                }

                const demotedUser : ChatUser | undefined = this.getUserFromUsername(command[1]);
                if (demotedUser === undefined) {
                    socket.emit('error', 'User: ' + command[1] + ' does not exist !');
                    return true;
                }
                const ret : undefined | string = await this.chanService.setIsAdmin(chan.id, user.id, demotedUser.id, false);
                if (typeof ret === 'string') {
                    socket.emit('error', ret);
                    return true;
                }
                server.to(chan.id.toString()).emit('msgToClient', {author: user.username, chan: chan.title, msg: demotedUser.username + ' is no longer an Admin !'})
                demotedUser.socket.emit('error', 'You have been demoted to admin in ' + chan.title + ' channel !\nRemember : With great power comes great responsabilities.');
                return true;
            }
            case "/password" : {
                if (user.id !== chan.ownerId) {
                    socket.emit('error', 'Only owner can change the password !');
                    return true;
                }
                if (command.length > 2) {
                    socket.emit('error', 'password command need exactly one or no argument : /password <newPassword>.\n(leave empty to disable password');
                    return true;
                }

                if (command.length === 2) {
                    const ret : string | undefined = await this.chanService.chanChangePass(chan.id, user.id, command[1]);
                    if (typeof ret === 'string') {
                        socket.emit('error', ret);
                        return true;
                    }
                    socket.emit('error', 'Password changed to ' + command[1] + '.');
                }
                else {
                    const ret : string | undefined = await this.chanService.chanChangePass(chan.id, user.id, null);
                    if (typeof ret === 'string') {
                        socket.emit('error', ret);
                        return true;
                    }
                    socket.emit('error', 'Password disable.');
                }
                return true;
            }
            case "/help" : {
                if (command.length != 1) {
                    socket.emit('error', 'usage : /help');
                    return true;
                }
                let newMessage : any = {
                    date: "(command)",
                    authorId: user.id,
                    author: user.username,
                    chan: chan.title,
                    msg: "Owner/Admin commands :\n- /invite <username> to invite a user in this channel\n- /mute <username> <duration(minutes)> to mute a user for the duration (/unmute <username> to end the mute earlier)\n- /ban <username> <duration(minutes)> to ban a user for the duration (/unban <username> to end the ban earlier)\nOwner only commands :\n- /promote <username> to give a user the admin status (/demote <username> to revoke the status)\n- /password <newpassword> to change the chan password (activate password if chan didn't have one before, to clear password just send '/password'"
                };
                socket.emit('msgToClient', newMessage);
                return true;
            }
            default : {
                return false;
            }
        }
    }
}