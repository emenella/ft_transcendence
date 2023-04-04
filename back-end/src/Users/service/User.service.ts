import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { Avatar } from "../entity/Avatar.entity";
import { MatchHistory } from '../entity/History.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
        ) {}
        
        async getAllUsers(): Promise<User[]> {
            const users = await this.userRepository.find({ relations: ["avatar", "winMatch", "looseMatch", "friends"] });
            return users;
        }
        
        async getUserById(id: number): Promise<User> {
            const user = await this.userRepository.findOne({ where: { id: id }, relations: ["avatar", "winMatch", "looseMatch", "friends", "blacklist"] });
            if (!user)
            throw new HttpException(`User with ID ${id} not found.`, 404);
            return user;
        }
        
        async getUserByLogin(username: string): Promise<User> {
            const user = await this.userRepository.findOne({ where: { username: username }, relations: ["avatar", "winMatch", "looseMatch", "friends", "blacklist"] });
            if (!user)
            throw new HttpException(`User with username ${username} not found.`, 404);
            return user;
        }
        
        async createUser(body: User): Promise<User> {
            return await this.userRepository.save(body);
        }
        
        async updateUsername(id: number, username: string): Promise<User> {
            const userToUpdate = await this.userRepository.findOne({where : { id: id }});
            if(!username)
            throw new HttpException(`Username is empty.`, 400);
            if (!userToUpdate) {
                throw new HttpException(`User with ID ${id} not found.`, 404);
            }
            userToUpdate.username = username;
            userToUpdate.isProfileComplete = true;
            return await this.userRepository.save(userToUpdate);
        }
        
        async updateUser(id: number, updatedUser: User): Promise<User> {
            const userToUpdate = await this.userRepository.findOne({where : { id: id }});
            if (!userToUpdate) {
                throw new HttpException(`User with ID ${id} not found.`, 404);
            }
            if (updatedUser.username)
            userToUpdate.username = updatedUser.username;
            if (updatedUser.connection)
            userToUpdate.connection = updatedUser.connection;
            return await this.userRepository.save(userToUpdate);
        }
        
        async deleteUser(id: number): Promise<void> {
            await this.userRepository.delete(id);
        }
        
        async getUserFromConnectionId(connectionId: number): Promise<User> {
            const user = await this.userRepository.findOne({ where: { connection: {id: connectionId} }, relations: ["avatar", "winMatch", "looseMatch", "friends", "blacklist"] });
            if (!user)
            throw new HttpException(`User with connectionID ${connectionId} not found.`, 404);
            return user;
        }
        
        async uploadAvatar(id: number, file: Express.Multer.File): Promise<string> {
            let user = await this.userRepository.findOne({ where: { id: id }, relations: ["avatar"] });
            if (!user)
                throw new HttpException(`User with ID ${id} not found.`, 404);
            if (!user.isProfileComplete)
                throw new HttpException(`User with ID ${id} has not completed his profile.`, 400);
            if (!user.avatar)
            {
                user.avatar = new Avatar();
                user.avatar.user = user;
                user.avatar.path = file.path;
            }
            else
            {
                user.avatar.path = file.path;
            }
            await this.userRepository.save(user);
            return file.path;
        }
        
        async getFriends(user: User): Promise<User[]> {
            return user.friends;
        }
        
		async inviteFriend(user: User, friend: User): Promise<void> {
			if (user.friends.some(f => f.id === friend.id))
				throw new HttpException(`User with ID ${friend.id} is already a friend of User with ID ${user.id}.`, 400);
			else if (friend.friend_invites.some(f => f.id === user.id))
				throw new HttpException(`User with ID ${friend.id} already has pending friend invite from User with ID ${user.id}.`, 400);
			else if (user.friend_invites.some(f => f.id === friend.id)) {
				this.acceptFriend(user, friend);
			}
			else {
				friend.friend_invites.push(user);
				friend.friend_invites.sort((a, b) => (a.username > b.username ? -1 : 1));
				await this.userRepository.save(user);
				await this.userRepository.save(friend);
			}
		}

		async getMatchHistory(user: User): Promise<MatchHistory[]> {
			const matchHistory: MatchHistory[] = user.winMatch.concat(user.looseMatch);
			matchHistory.sort((a, b) => (a.date > b.date ? -1 : 1));
            return matchHistory;
        }

        async acceptFriend(user: User, friend: User): Promise<void> {
            if (user.friends.some(f => f.id === friend.id))
                throw new HttpException(`User with ID ${friend.id} is already a friend of User with ID ${user.id}.`, 400);
			else if (!user.friend_invites.some(f => f.id === friend.id)) {
                throw new HttpException(`User with ID ${friend.id} has no pending friend invite from User with ID ${user.id}.`, 400);
			}
			else {
                user.friend_invites.splice(user.friends.indexOf(friend), 1)
				user.friends.push(friend);
				user.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
				friend.friends.push(user);
				friend.friends.sort((a, b) => (a.username > b.username ? -1 : 1));
				await this.userRepository.save(user);
				await this.userRepository.save(friend);
            }
        }
        
        async denyFriend(user: User, friend: User): Promise<void> {
			if (!user.friend_invites.some(f => f.id === friend.id))
                throw new HttpException(`User with ID ${friend.id} has no pending friend invite from User with ID ${user.id}.`, 400);
			else {
				user.friend_invites.splice(user.friends.indexOf(friend), 1);
				await this.userRepository.save(user);
			}
		}

        async removeFriend(user: User, friend: User): Promise<void> {
            const userIndex = friend.friends.findIndex(f => f.id === user.id);
            const friendIndex = user.friends.findIndex(f => f.id === friend.id);
            if (userIndex === -1 || friendIndex === -1) {
                throw new HttpException(`User with ID ${friend.id} is not a friend of User with ID ${user.id}.`, 400);
            }
            else {
                user.friends.splice(friendIndex, 1);
                friend.friends.splice(userIndex, 1);
                await this.userRepository.save(user);
                await this.userRepository.save(friend);
            }
        }
        
        async getBlacklist(user: User): Promise<User[]> {
            return user.blacklist;
        }
        
        async addBlacklist(user: User, userToBlacklist: User): Promise<void> {
            if (user.blacklist.some(f => f.id === userToBlacklist.id))
            throw new HttpException(`User with ID ${userToBlacklist.id} is already blocked by User with ID ${user.id}.`, 400);
            else {
                user.blacklist.push(userToBlacklist);
                user.blacklist.sort();
                await this.userRepository.save(user);
            }
        }
        
        async removeBlacklist(user: User, userToBlacklist: User): Promise<void> {
            if (!user.blacklist.some(f => f.id === userToBlacklist.id))
            throw new HttpException(`User with ID ${userToBlacklist.id} is not blocked by User with ID ${user.id}.`, 400);
            else {
                user.blacklist.splice(user.friends.indexOf(userToBlacklist), 1);
                await this.userRepository.save(user);
            }
        }
        
        async getAvatar(id: number): Promise<Avatar> {
            const user = await this.userRepository.findOne({ where: { id: id }, relations: ["avatar"] });
            if (!user)
            throw new HttpException(`User with ID ${id} not found.`, 404);
            if (!user.avatar)
            throw new HttpException(`User with ID ${id} has no avatar.`, 404);
            return user.avatar;
        }
        
    }