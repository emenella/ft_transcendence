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
        const user = await this.userRepository.findOne({ where: { id: id } });
        return user;
    }

    async getUserByLogin(login: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { login: login } });
        return user;
    }

    async createUser(body: User): Promise<User> {
        return await this.userRepository.save(body);
    }

    async updateUser(id: number, updatedUser: User): Promise<User> {
        const userToUpdate = await this.userRepository.findOne({where : { id: id }});
        if (!userToUpdate) {
            throw new HttpException(`User with ID ${id} not found.`, 404);
        }
        userToUpdate.login = updatedUser.login;
        userToUpdate.connection = updatedUser.connection;
        return await this.userRepository.save(userToUpdate);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.delete(id);
    }

    async getUserFromConnectionId(connectionId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { connection: {id: connectionId} } });
        return user;
    }
}