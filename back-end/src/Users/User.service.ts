import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./User.entity";

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

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: parseInt(id) } });
        return user;
    }

    async getUserByLogin(login: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { login: login } });
        return user;
    }

    async createUser(body: User): Promise<void> {
        await this.userRepository.save(body);
    }

    async updateUser(id: string, body: User): Promise<void> {
        await this.userRepository.update(id, body);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.delete(id);
    }
}