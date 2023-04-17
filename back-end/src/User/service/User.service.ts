import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { Match } from '../entity/Match.entity';
import { Connection } from "../entity/Connection.entity";
import { HistoryService } from "./Match.service";

export const enum UserStatus {
	Disconnected,
	Connected,
	InGame,
	Inactive
}

const UserRelations: string[] = ["connection", "winMatch", "loseMatch", "ownedChans", "relations", "messages", "friends", "friend_requests", "blacklist"]

const UsernameMaxLength: number = 16;

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly historyService: HistoryService) {}

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
	}

	async getUserByConnectionId(connectionId: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { connection: { id: connectionId } }, relations: UserRelations });
		if (!user)
			throw new HttpException(`User with connectionID ${connectionId} not found.`, 404);
		return user;
	}

	//--- HTTP REQUESTS ---

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
	async updateUsername(id: number, username: string): Promise<User> {
		if (!username)
			throw new HttpException(`Username is empty.`, 400);
		const userToUpdate = await this.userRepository.findOneBy({ id: id });
		if (!userToUpdate)
			throw new HttpException(`User with ID ${id} not found.`, 404);
		if (await this.userRepository.findOneBy({ username: username }))
			throw new HttpException(`Username already taken.`, 400);
		if (username.length > UsernameMaxLength)
			throw new HttpException(`Username too long (max_length=${UsernameMaxLength}).`, 400);
		userToUpdate.username = username;
		userToUpdate.isProfileComplete = true;
		return await this.userRepository.save(userToUpdate);
	}

	async uploadAvatar(id: number, file: Express.Multer.File): Promise<string> {
		let user = await this.userRepository.findOne({ where: { id: id }, relations: UserRelations });
		if (!user)
			throw new HttpException(`User with ID ${id} not found.`, 404);
		user.avatarPath = file.path;
		await this.userRepository.save(user);
		return file.path;
	}

	async getMatchHistory(user: User): Promise<Match[]> {
		const matchHistory: Match[] = await this.historyService.getAllMatchesByUser(user.id);
		return matchHistory;
	}

	//~~FRIENDS
	async inviteFriend(sender: User, receiver: User): Promise<void> {
		if (sender.friends.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`User with ID ${receiver.id} is already friend with User with ID ${sender.id}.`, 400);
		else if (receiver.friend_requests.some((f) => { return f.id === sender.id }))
			throw new HttpException(`User with ID ${receiver.id} already has pending friend request from User with ID ${sender.id}.`, 400);
		else if (receiver.blacklist.some((f) => { return f.id === sender.id }))
			throw new HttpException(`User with ID ${receiver.id} has blocked User with ID ${sender.id}.`, 400);
		else if (sender.friend_requests.some((f) => { return f.id === receiver.id }))
			this.acceptFriend(sender, receiver);
		else {
			receiver.friend_requests.push(sender);
			receiver.friend_requests.sort((a, b) => (a.username > b.username ? -1 : 1));
			await this.userRepository.save(sender);
			await this.userRepository.save(receiver);
		}
	}

	async acceptFriend(sender: User, receiver: User): Promise<void> {
		if (sender.friends.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`User with ID ${receiver.id} is already friend with User with ID ${sender.id}.`, 400);
		else if (!sender.friend_requests.some((f) => { return f.id === receiver.id }))
			throw new HttpException(`User with ID ${receiver.id} have no pending friend request from User with ID ${sender.id}.`, 400);
		else {
			sender.friend_requests.splice(sender.friends.indexOf(receiver), 1)
			sender.friends.push(receiver);
			sender.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
			receiver.friends.push(sender);
			receiver.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
			await this.userRepository.save(sender);
			await this.userRepository.save(receiver);
		}
	}

	async denyFriend(receiver: User, sender: User): Promise<void> {
		if (!receiver.friend_requests.some((f) => { return f.id === sender.id }))
			throw new HttpException(`User with ID ${receiver.id} have no pending friend request from User with ID ${sender.id}.`, 400);
		else {
			receiver.friend_requests.splice(receiver.friends.indexOf(sender), 1);
			await this.userRepository.save(receiver);
		}
	}

	async removeFriend(user: User, friend: User): Promise<void> {
		const userIndex = friend.friends.findIndex((f) => { return f.id === user.id });
		const friendIndex = user.friends.findIndex((f) => { return f.id === friend.id });
		if (userIndex === -1 || friendIndex === -1) {
			throw new HttpException(`User with ID ${friend.id} is not friend with User with ID ${user.id}.`, 400);
		}
		else {
			user.friends.splice(friendIndex, 1);
			friend.friends.splice(userIndex, 1);
			await this.userRepository.save(user);
			await this.userRepository.save(friend);
		}
	}

	//~~ BLACKLIST
	async addBlacklist(user: User, userToBlock: User): Promise<void> {
		if (user.blacklist.some((f) => { return f.id === userToBlock.id }))
			throw new HttpException(`User with ID ${userToBlock.id} is already blocked by User with ID ${user.id}.`, 400);
		else {
			user.blacklist.push(userToBlock);
			user.blacklist.sort();
			const userIndexF = userToBlock.friends.findIndex((f) => { return f.id === user.id });
			const userToBlockIndexF = user.friends.findIndex((f) => { return f.id === userToBlock.id });
			const userIndexR = userToBlock.friend_requests.findIndex((f) => { return f.id === user.id });
			const userToBlockIndexR = user.friend_requests.findIndex((f) => { return f.id === userToBlock.id });

			if (userIndexF != -1 && userToBlockIndexF != -1) {
				user.friends.splice(userToBlockIndexF, 1);
				userToBlock.friends.splice(userIndexF, 1);
			}
			else {
				if (userIndexR != -1)
					userToBlock.friend_requests.splice(userIndexR, 1);
				if (userToBlockIndexR != -1)
					user.friend_requests.splice(userToBlockIndexR, 1);
			}
			await this.userRepository.save(user);
		}
	}

	async removeBlacklist(user: User, blockedUser: User): Promise<void> {
		if (!user.blacklist.some((f) => { return f.id === blockedUser.id }))
			throw new HttpException(`User with ID ${blockedUser.id} is not blocked by User with ID ${user.id}.`, 400);
		else {
			user.blacklist.splice(user.friends.indexOf(blockedUser), 1);
			await this.userRepository.save(user);
		}
	}
}
