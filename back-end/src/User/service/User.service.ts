import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { Connection } from "../entity/Connection.entity";
import { SocketService } from "../../Socket/Socket.service";
import { ChatService } from "../../Chat/Chat.service";
import { SockEvent } from "src/Socket/Socket.gateway";
import { GameService } from "src/Game/Game.service";
import * as Jimp from 'jimp';

export const enum UserStatus {
	Disconnected,
	Connected,
	InGame,
}
const UserRelations: string[] = ["matchsWon", "matchsLost", "friends", "friendRequests", "blacklist"]
const UsernameMaxLength: number = 16;
const UnsupportedCharset = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\ ]/;
const AvailableColors: Array<string> = ["white", "red", "orange", "yellow", "green", "blue"];

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
				private readonly socketService: SocketService,
				@Inject(forwardRef(() => ChatService)) private readonly chatService: ChatService,
				@Inject(forwardRef(() => GameService)) private readonly gameService: GameService) {}

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
		user.friends.forEach(async friend => {
			let socket = await this.socketService.getUserById(friend.id).then((user: User) => { return user.socket; });
			if (socket)
				socket.emit(SockEvent.SE_US_STATUS, { friendId: user.id, newStatus: newStatus });
		});
	}

	async setFriendsStatus(user: User): Promise<User> {
		for(let friend of user.friends) {
			let friendSocket = await this.socketService.getUserById(friend.id).then((user: User) => { return user.socket; });
			if (friendSocket)
				friend.status = this.gameService.findGamesIdWithPlayer(friend.id).length ? UserStatus.InGame : UserStatus.Connected;
			else
				friend.status = UserStatus.Disconnected;
		}
		user.friends.sort((a, b) => {
			if (a.status && b.status)
				return (a.username > b.username ? -1 : 1);
			else
				return (a.status > b.status ? -1 : 1);
		});
		return user;
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
		if (!username || username === "")
			throw new HttpException(`Username is empty.`, 400);
		if (await this.userRepository.findOneBy({ username: username }))
			throw new HttpException(`Username already taken.`, 400);
		if (username.length > UsernameMaxLength)
			throw new HttpException(`Username must not exceed ${UsernameMaxLength} characters.).`, 400);
		if (UnsupportedCharset.test(username))
			throw new HttpException(`Username must not contain any of those characters: \"${UnsupportedCharset}\".`, 400);
		user.username = username;
		user.isProfileComplete = true;
		return await this.userRepository.save(user);
	}

	async uploadAvatar(user: User, file: Express.Multer.File): Promise<string> {
		try {
			await Jimp.read(file.destination + file.filename).then((image) => {
				if (image.bitmap.width > 1000 || image.bitmap.height > 1000) {
					image.resize(1000, 1000).write(file.path);
		  		}
			});
		} catch (error) {
		  	throw new HttpException(`Error while processing image.`, 400);
		}
	  
		user.avatarPath = file.path;
		await this.userRepository.save(user);
		return user.avatarPath;
	  }

	async changeColor(user: User, color: string): Promise<void> {
		if (AvailableColors.indexOf(color) > -1)
			user.color = color;
		else
			throw new HttpException(`${color} is not a valid color.`, 400);
		await this.userRepository.save(user);
	}

	//~~FRIENDS
	async inviteFriend(sender: User, receiver: User): Promise<void> {
		if (sender.id === receiver.id)
			throw new HttpException(`You can not send a friend request to yourself, go touch some grass.`, 400);
		else if (sender.friends.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`You are already friend with ${sender.username}.`, 400);
		else if (receiver.friendRequests.some((f) => { return f.id === sender.id }))
			throw new HttpException(`${receiver.username} already have a pending friend request from you.`, 400);
		else if (receiver.blacklist.some((f) => { return f.id === sender.id }))
			throw new HttpException(`${receiver.username} blocked you.`, 400);
		else if (sender.blacklist.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`You blocked ${receiver.username}.`, 400);
		else if (sender.friendRequests.some((f) => { return f.id === receiver.id }))
			this.acceptFriend(sender, receiver);
		else {
			receiver.friendRequests.push(sender);
			receiver.friendRequests.sort((a, b) => (a.username > b.username ? -1 : 1));
			await this.userRepository.save(sender);
			await this.userRepository.save(receiver);
			this.emitRefreshFront(receiver.id);
		}
	}

	async acceptFriend(sender: User, receiver: User): Promise<void> {
		if (sender.friends.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`You are already friend with ${receiver.username}.`, 400);
		else if (!sender.friendRequests.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`You have no pending friend request from ${receiver.username}.`, 400);
		else {
			sender.friendRequests.splice(sender.friends.indexOf(receiver), 1)
			sender.friends.push(receiver);
			sender.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
			receiver.friends.push(sender);
			receiver.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
			await this.userRepository.save(sender);
			await this.userRepository.save(receiver);
			this.emitRefreshFront(sender.id);
			this.emitRefreshFront(receiver.id);
			const ret = await this.chatService.createDMChan(sender.id, receiver.id);
			if (ret !== true)
				throw new HttpException(`Couldn't create DM channel: ${ret}`, 400);
		}
	}

	async denyFriend(receiver: User, sender: User): Promise<void> {
		if (!receiver.friendRequests.some((f) => { return f.id === sender.id }))
			throw new HttpException(`You have no pending friend request from ${sender.username}.`, 400);
		else {
			receiver.friendRequests.splice(receiver.friends.indexOf(sender), 1);
			await this.userRepository.save(receiver);
		}
		this.emitRefreshFront(receiver.id);
	}

	async removeFriend(user: User, friend: User): Promise<void> {
		const userIndex = friend.friends.findIndex((f) => { return f.id === user.id });
		const friendIndex = user.friends.findIndex((f) => { return f.id === friend.id });
		if (userIndex === -1 || friendIndex === -1)
			throw new HttpException(`You are not friend with ${friend.username}.`, 400);
		else {
			user.friends.splice(friendIndex, 1);
			friend.friends.splice(userIndex, 1);
			await this.userRepository.save(user);
			await this.userRepository.save(friend);
			this.emitRefreshFront(user.id);
			this.emitRefreshFront(friend.id);
			if (await this.chatService.leaveDM(user.id, friend.id) !== true)
				throw new HttpException(`Couldn't delete channel.`, 400);
		}
	}

	//~~ BLACKLIST
	async addBlacklist(user: User, userToBlock: User): Promise<void> {
		if (user.blacklist.some((f) => { return f.id === userToBlock.id }))
			throw new HttpException(`You have already blocked ${userToBlock.username}.`, 400);
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
			this.emitRefreshFront(user.id);
			this.emitRefreshFront(userToBlock.id);
			if (userIndexF != -1 && userToBlockIndexF != -1 && await this.chatService.leaveDM(user.id, userToBlock.id) !== true)
				throw new HttpException(`Couldn't create channel.`, 400);
		}
	}

	async removeBlacklist(user: User, blockedUser: User): Promise<void> {
		if (!user.blacklist.some((f) => { return f.id === blockedUser.id }))
			throw new HttpException(`You have not blocked ${blockedUser.username}.`, 400);
		else {
			user.blacklist.splice(user.friends.indexOf(blockedUser), 1);
			await this.userRepository.save(user);
		}
		this.emitRefreshFront(user.id);
	}

	async emitRefreshFront(id: number) {
		let socket = await this.socketService.getUserById(id).then((user: User) => { return user.socket; });
		if (socket)
			socket.emit(SockEvent.SE_UPDATE_FRONT);
	}
}
