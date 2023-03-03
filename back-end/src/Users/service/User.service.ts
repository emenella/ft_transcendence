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
        const user = await this.userRepository.findOne({ where: { connection: {id: connectionId} }, relations: ["avatar", "winMatch", "looseMatch"] });
        if (!user)
            throw new HttpException(`User with connectionID ${connectionId} not found.`, 404);
        return user;
    }

    async uploadAvatar(id: number, file): Promise<string> {
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

    async getAvatar(id: number): Promise<Avatar> {
        const user = await this.userRepository.findOne({ where: { id: id }, relations: ["avatar"] });
        if (!user)
            throw new HttpException(`User with ID ${id} not found.`, 404);
        if (!user.avatar)
            throw new HttpException(`User with ID ${id} has no avatar.`, 404);
        return user.avatar;
    }

}