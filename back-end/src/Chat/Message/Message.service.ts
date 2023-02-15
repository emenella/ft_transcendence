import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./Message.entity";
import { Chan } from "../Chan.entity";
import { User } from "src/Users/User.entity";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
    ) {}

    async createMessage(body: Message) {
        return await this.messageRepository.save(body);
    }

    async getMessage(messageId : Message["id"]): Promise<Message> {
        const message = await this.messageRepository.findOneOrFail({ where: { id: messageId } });
        return message;
    }

    async getAllMessages(): Promise<Message[]> {
        const messages = await this.messageRepository.findOrFail();
        return messages;
    }

    async getMessagesFromChanId(chanId : Chan["id"]): Promise<Message[]> {
        const messages = await this.messageRepository.find({ where: { id: chanId } });
        return messages;
    }

    async getMessagesFromChanTitle(chanTitle : Chan["title"]): Promise<Message[]> {
        const messages = await this.messageRepository.find({ where: { title: chanTitle } });
        return messages;
    }

    async getMessagesFromUserId(userId : User["id"]): Promise<Message[]> {
        const messages = await this.messageRepository.find({ where: { id: userId } });
        return messages;
    }

    async getMessagesFromUserLogin(userLogin : User["login"]): Promise<Message[]> {
        const messages = await this.messageRepository.find({ where: { login: userLogin } });
        return messages;
    }

    async getMessagesFromUserName(userName : User["username"]): Promise<Message[]> {
        const messages = await this.messageRepository.find({ where: { username: userName } });
        return messages;
    }

    async deleteMessage(id: Message["id"]) {
        await this.messageRepository.delete(id);
    }
}