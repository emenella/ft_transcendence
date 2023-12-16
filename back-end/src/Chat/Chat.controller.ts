// import { Controller, Get, Post, Delete,  } from "@nestjs/common";
// import { ChatService } from "./Chat.service";
// import { ChanService } from "./Chan/Chan.service";
// import { MessageService } from "./Message/Message.service";
// import { Chan } from "./Chan/Chan.entity";

// @Controller("Chat")
// export class ChatControllers {
// 	constructor(private readonly chatService: ChatService,
// 				private readonly channelService: ChanService,
// 				private readonly messageService: MessageService) { }

// 	@Post()
// 	async createChannel(@Body("chan") chan: Chan): Promise<Chan> {
// 		return this.channelService.createChan(chan);
// 	}

	// @Post()
	// async create(@Param("user") user: User, @Param("chan") chan: Chan, @Param("content") content: Chat["content"]): Promise<Chat> {
	//     return this.chatService.createChat(user, user.username, chan, content);
	// }

	// @Get(":id")
	// async findId(@Param("id") messageId: Chat["id"]): Promise<Chat> {
	//     return this.chatService.getChat(messageId);
	// }

	// @Get()
	// async findAll(): Promise<Chat[]> {
	//     return this.chatService.getAllChats();
	// }

	// @Get(":chanId")
	// async findAllFromChanId(@Param("chanId") chanId: Chan["id"]): Promise<Chat[]> {
	//     return this.chatService.getChatsFromChanId(chanId);
	// }

	// @Get(":chanTitle")
	// async findAllFromChanTitle(@Param("chanTitle") chanTitle: Chan["title"]): Promise<Chat[]> {
	//     return this.chatService.getChatsFromChanTitle(chanTitle);
	// }

	// @Get(":userId")
	// async findAllFromUserId(@Param("userId") userId: User["id"]): Promise<Chat[]> {
	//     return this.chatService.getChatsFromUserId(userId);
	// }

	// @Get(":userName")
	// async findAllFromUserName(@Param("userName") username: User["username"]): Promise<Chat[]> {
	//     return this.chatService.getChatsFromUserName(username);
	// }

	// @Delete(":id")
	// async delete(@Param("id") id: Chat["id"]) {
	//     this.chatService.deleteChat(id);
	// }

// }