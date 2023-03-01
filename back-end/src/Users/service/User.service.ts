import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { Avatar } from "../entity/Avatar.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ["avatar", "winMatch", "looseMatch"]});
        return users;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id }, relations: ["avatar", "winMatch", "looseMatch"] });
        if (!user)
            throw new HttpException(`User with ID ${id} not found.`, 404);
        return user;
    }

    async getUserByLogin(username: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { username: username }, relations: ["avatar", "winMatch", "looseMatch"] });
        if (!user)
            throw new HttpException(`User with username ${username} not found.`, 404);
        return user;
    }

    async createUser(body: User): Promise<User> {
        return await this.userRepository.save(body);
    }

    async updateUsername(id: number, updatedUser: User): Promise<User> {
        const userToUpdate = await this.userRepository.findOne({where : { id: id }, relations: ["avatar", "winMatch", "looseMatch"]});
        if (!userToUpdate) {
            throw new HttpException(`User with ID ${id} not found.`, 404);
        }
        if (updatedUser.username)
            userToUpdate.username = updatedUser.username;
        else
            throw new HttpException(`Username is required.`, 400);
        return await this.userRepository.save(userToUpdate);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async getUserFromConnectionId(connectionId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { connection: {id: connectionId} }, relations: ["avatar", "winMatch", "looseMatch"] });
        if (!user)
            throw new HttpException(`User with connectionID ${connectionId} not found.`, 404);
        return user;
    }

    async uploadAvatar(id: number, file): Promise<void> {
        let user = await this.userRepository.findOne({ where: { id: id }, relations: ["avatar"] });
        if (!user)
            throw new HttpException(`User with ID ${id} not found.`, 404);
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