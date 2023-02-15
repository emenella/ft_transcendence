import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { Message } from "./Message.entity";
import { Chan } from "../Chan.entity";
import { User } from "src/Users/User.entity";
import { MessageService } from "./Message.service";

@Controller("Message")
export class MessageControllers {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    async create(@Body() message: Message): Promise<Message> {
        return this.messageService.createMessage(message);
    }

    @Get(":id")
    async findId(@Param("id") messageId: Message["id"]): Promise<Message> {
        return this.messageService.getMessage(messageId);
    }

    @Get()
    async findAll(): Promise<Message[]> {
        return this.messageService.getAllMessages();
    }

    @Get(":chanId")
    async findAllFromChanId(@Param("chanId") chanId: Chan["id"]): Promise<Message[]> {
        return this.messageService.getMessagesFromChanId(chanId);
    }

    @Get(":chanTitle")
    async findAllFromChanTitle(@Param("chanTitle") chanTitle: Chan["title"]): Promise<Message[]> {
        return this.messageService.getMessagesFromChanTitle(chanTitle);
    }

    @Get(":userId")
    async findAllFromUserId(@Param("userId") userId: User["id"]): Promise<Message[]> {
        return this.messageService.getMessagesFromUserId(userId);
    }

    @Get(":userLogin")
    async findAllFromUserLogin(@Param("userLogin") userLogin: User["login"]): Promise<Message[]> {
        return this.messageService.getMessagesFromUserLogin(userLogin);
    }

    @Get(":userName")
    async findAllFromUserName(@Param("userName") username: User["username"]): Promise<Message[]> {
        return this.messageService.getMessagesFromUserName(username);
    }

    @Delete(":id")
    async delete(@Param("id") id: Message["id"]) {
        this.messageService.deleteMessage(id);
    }

}