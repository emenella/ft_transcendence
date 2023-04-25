import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { Connection } from "../entity/Connection.entity";
import { SocketService } from "../../Socket/Socket.service";
import { ChatService } from "../../Chat/Chat.service";

export const enum UserStatus {
	Disconnected,
	Connected,
	InGame,
}
const UserRelations: string[] = ["connection", "matchsWon", "matchsLost", "ownedChans", "relations", "messages", "friends", "friendRequests", "blacklist"]
const UsernameMaxLength: number = 16;
const UnsupportedCharset: string = "`~!@#$%^&*()-+={[}]\\|:;'\",<.>/?";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
				private readonly socketService: SocketService,
				@Inject(forwardRef(() => ChatService)) private readonly chatService: ChatService) {}

	async createUser(user: User, connection: Connection): Promise<User> {
		user.connection = connection;
		return await this.userRepository.save(user);
	}

	async updateUser(id: number, updatedUser: User): Promise<User> {
		const userToUpdate = await this.userRepository.findOneBy({ id: id });
		if (!userToUpdate)
			throw new HttpException(`User with ID ${id} not found.`, 404);
		if (updatedUser.username) userToUpdate.username = updatedUser.username;
		if (updatedUser.connection) userToUpdate.connection = updatedUser.connection;
		if (updatedUser.avatarPath) userToUpdate.avatarPath = updatedUser.avatarPath;
		if (updatedUser.elo) userToUpdate.elo = updatedUser.elo;
		return await this.userRepository.save(userToUpdate);
	}
	
	async deleteUser(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}

	async change2FA(user: User, state: boolean): Promise<void> {
		user.is2FAActivated = state;
		await this.userRepository.save(user);
	}

	async changeStatus(user: User, newStatus: number): Promise<void> {
		user.status = newStatus;
		await this.userRepository.save(user);
		user.friends.forEach(friend => { this.emitFriendListChangement(friend.id); });
	}

	async getUserByConnectionId(connectionId: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { connection: { id: connectionId } }, relations: UserRelations });
		if (!user)
			throw new HttpException(`User with connectionID ${connectionId} not found.`, 404);
		return user;
	}

	//--- HTTP REQUESTS ---

	async getLightUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: id }, relations: UserRelations });
		if (!user)
			throw new HttpException(`User with ID ${id} not found.`, 404);
		let lightUser = new User();
		lightUser.id = user.id;
		lightUser.username = user.username;
		lightUser.avatarPath = user.avatarPath;
		lightUser.isProfileComplete = user.isProfileComplete;
		lightUser.status = user.status;
		lightUser.color = user.color;
		lightUser.matchsWon = user.matchsWon;
		lightUser.matchsLost = user.matchsLost;
		lightUser.elo = user.elo;
		return lightUser;
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: id }, relations: UserRelations });
		if (!user)
			throw new HttpException(`User with ID ${id} not found.`, 404);
		return user;
	}

	async getUserByUsername(username: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { username: username }, relations: UserRelations });
		if (!user)
			throw new HttpException(`User with username ${username} not found.`, 404);
		return user;
	}

	async getAllUsers(): Promise<User[]> {
		const users = await this.userRepository.find({ relations: UserRelations });
		return users;
	}

	//~~ SET INFO
	async updateUsername(user: User, username: string): Promise<User> {
		if (!username)
			throw new HttpException(`Username is empty.`, 400);
		if (await this.userRepository.findOneBy({ username: username }))
			throw new HttpException(`Username already taken.`, 400);
		if (username.length > UsernameMaxLength)
			throw new HttpException(`Username must not exceed ${UsernameMaxLength} characters.).`, 400);
		if (username.includes(UnsupportedCharset))
			throw new HttpException(`Username must not contain any of those characters: \"${UnsupportedCharset}\".).`, 400);
		user.username = username;
		user.isProfileComplete = true;
		return await this.userRepository.save(user);
	}

	async uploadAvatar(user: User, file: Express.Multer.File): Promise<string> {
		user.avatarPath = file.path;
		await this.userRepository.save(user);
		return file.path;
	}

	async changeColor(user: User, color: string): Promise<void> {
		user.color = color;
		await this.userRepository.save(user);
	}

	//~~FRIENDS
	async inviteFriend(sender: User, receiver: User): Promise<{ok: boolean, msg: string}> {
		if (sender.id === receiver.id)
			return {ok: false, msg: `You can not send a friend request to yourself, go touch some grass.`};
		else if (sender.friends.some((f) => { return f.id === receiver.id }))
			return {ok: false, msg: `You are already friend with ${sender.username}.`};
		else if (receiver.friendRequests.some((f) => { return f.id === sender.id }))
			return {ok: false, msg: `${receiver.username} already have a pending friend request from you.`};
		else if (receiver.blacklist.some((f) => { return f.id === sender.id }))
			return {ok: false, msg: `${receiver.username} blocked you.`,};
		else if (sender.blacklist.some((f) => { return f.id === receiver.id }))
			return {ok: false, msg: `You blocked ${receiver.username}.`};
		else if (sender.friendRequests.some((f) => { return f.id === receiver.id })) {
			this.acceptFriend(sender, receiver);
			return {ok: true, msg: "Invitation accepted."};
		} else {
			receiver.friendRequests.push(sender);
			receiver.friendRequests.sort((a, b) => (a.username > b.username ? -1 : 1));
			await this.userRepository.save(sender);
			await this.userRepository.save(receiver);
			return {ok: true, msg: "Invitation sent."};
		}
	}

	async acceptFriend(sender: User, receiver: User): Promise<{ok: boolean, msg: string}> {
		if (sender.friends.some((f) => { return f.id === receiver.id }))
			return {ok: false, msg: `You are already friend with ${receiver.username}.`};
		else if (!sender.friendRequests.some((f) => { return f.id === receiver.id }))
			return {ok: false, msg: `You have no pending friend request from ${receiver.username}.`};
		else {
			sender.friendRequests.splice(sender.friends.indexOf(receiver), 1)
			sender.friends.push(receiver);
			sender.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
			receiver.friends.push(sender);
			receiver.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
			await this.userRepository.save(sender);
			await this.userRepository.save(receiver);
			this.emitFriendListChangement(sender.id);
			this.emitFriendListChangement(receiver.id);
			if (await this.chatService.createDMChan(sender.id, receiver.id) !== true)
				return {ok: false, msg: `Couldn't create DM channel.`};
			return {ok: true, msg: "Friend request accepted."}
		}
	}

	async denyFriend(receiver: User, sender: User): Promise<{ok: boolean, msg: string}> {
		if (!receiver.friendRequests.some((f) => { return f.id === sender.id }))
			return {ok: false, msg: `You have no pending friend request from ${sender.username}.`};
		else {
			receiver.friendRequests.splice(receiver.friends.indexOf(sender), 1);
			await this.userRepository.save(receiver);
			return {ok: true, msg: "Invitation denied."}
		}
	}

	async removeFriend(user: User, friend: User): Promise<{ok: boolean, msg: string}> {
		const userIndex = friend.friends.findIndex((f) => { return f.id === user.id });
		const friendIndex = user.friends.findIndex((f) => { return f.id === friend.id });
		if (userIndex === -1 || friendIndex === -1)
			return {ok: false, msg: `You are not friend with ${friend.username}.`};
		else {
			user.friends.splice(friendIndex, 1);
			friend.friends.splice(userIndex, 1);
			await this.userRepository.save(user);
			await this.userRepository.save(friend);
			this.emitFriendListChangement(user.id);
			this.emitFriendListChangement(friend.id);
			if (await this.chatService.leaveDM(user.id, friend.id) !== true)
				return {ok: false, msg: `Couldn't create channel.`};
			return {ok: true, msg: "Friend removed."};
		}
	}

	//~~ BLACKLIST
	async addBlacklist(user: User, userToBlock: User): Promise<{ok: boolean, msg: string}> {
		if (user.blacklist.some((f) => { return f.id === userToBlock.id }))
			return {ok: false, msg: `You have already blocked ${userToBlock.username}.`};
		else {
			user.blacklist.push(userToBlock);
			user.blacklist.sort();
			const userIndexF = userToBlock.friends.findIndex((f) => { return f.id === user.id });
			const userToBlockIndexF = user.friends.findIndex((f) => { return f.id === userToBlock.id });
			const userIndexR = userToBlock.friendRequests.findIndex((f) => { return f.id === user.id });
			const userToBlockIndexR = user.friendRequests.findIndex((f) => { return f.id === userToBlock.id });
			if (userIndexF != -1 && userToBlockIndexF != -1) {
				user.friends.splice(userToBlockIndexF, 1);
				userToBlock.friends.splice(userIndexF, 1);
				
			}
			else {
				if (userIndexR != -1)
					userToBlock.friendRequests.splice(userIndexR, 1);
				if (userToBlockIndexR != -1)
					user.friendRequests.splice(userToBlockIndexR, 1);
			}
			await this.userRepository.save(user);
			await this.userRepository.save(userToBlock);
			if (userIndexF != -1 && userToBlockIndexF != -1 && await this.chatService.leaveDM(user.id, userToBlock.id) !== true)
				return {ok: false, msg: `Couldn't create channel.`};
			this.emitFriendListChangement(user.id);
			this.emitFriendListChangement(userToBlock.id);
			return {ok: true, msg: "Added to blacklist."}
		}
	}

	async removeBlacklist(user: User, blockedUser: User): Promise<{ok: boolean, msg: string}> {
		if (!user.blacklist.some((f) => { return f.id === blockedUser.id }))
			return {ok: false, msg: `You have not blocked ${blockedUser.username}.`};
		else {
			user.blacklist.splice(user.friends.indexOf(blockedUser), 1);
			await this.userRepository.save(user);
			return {ok: true, msg: "Removed from blacklist."}
		}
	}

	emitFriendListChangement(id: number) {
		let socket = this.socketService.getSocketByUserId(id);
		if (socket !== undefined)
			socket.emit("friendListChangement");
	}
}
