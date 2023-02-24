import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
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

    async updateUser(id: number, updatedUser: User): Promise<User> {
        const userToUpdate = await this.userRepository.findOne({where : { id: id }, relations: ["avatar", "winMatch", "looseMatch"]});
        if (!userToUpdate) {
            throw new HttpException(`User with ID ${id} not found.`, 404);
        }
        userToUpdate.username = updatedUser.username;
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
    
    async getUserFromConnectionId(connectionId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { connection: {id: connectionId} } });
        return user;
    }
}