import { Controller, Get, Post, Body, Req, Query, UseInterceptors, UploadedFile, Delete } from "@nestjs/common";
import { Request } from "express";
import { User } from "./entity/User.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./service/User.service";
import { Match } from "./entity/Match.entity";
import { MatchService } from "./service/Match.service";


@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly matchService: MatchService) {}

	@Get("/me")
	async getMe(@Req() req : Request): Promise<User> {
		let user: User = await this.userService.setFriendsStatus(req.user as User);
		return user;
	}

	@Get("/id")
	async getUserById(@Query("id") id: number): Promise<User> {
		return await this.userService.getLightUserById(id);
	}

	@Get("/username")
	async getUserByUsername(@Query("username") username: string): Promise<User> {
		return await this.userService.getUserByUsername(username);
	}

	@Get("/all")
	async getAllUsers(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}

	//~~ GET INFO
	@Get("/match_history")
	async getMatchHistory(@Query("id") id: number): Promise<Match[]> {
		const player: User = await this.getUserById(id);
		return await this.matchService.getAllMatchesByUser(player.id);
	}

	//~~ SET INFO
	@Post("/me")
	async updateUsername(@Req() req : Request, @Body("username") username: string): Promise<User> {
		const user: User = await this.getMe(req);
		return await this.userService.updateUsername(user, username);
	}

	@Post("/avatar/upload")
	@UseInterceptors(FileInterceptor("file"))
	async uploadAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<string> {
		const user: User = await this.getMe(req);
		return await this.userService.uploadAvatar(user, file);
	}

	@Post("/color")
	async updateColor(@Req() req: Request, @Body("color") color: string): Promise<void> {
		const user: User = await this.getMe(req);
		return await this.userService.changeColor(user, color);
	}

	//~~FRIENDS
	@Post("/friends/invite")
	async inviteFriend(@Req() req: Request, @Body("username") username: string): Promise<void> {
		const sender: User = await this.getMe(req);
		const receiver: User = await this.getUserByUsername(username);
		await this.userService.inviteFriend(sender, receiver);
	}

	@Post("/friends/accept")
	async acceptFriend(@Req() req: Request, @Body("username") username: string): Promise<void> {
		const sender: User = await this.getMe(req);
		const receiver: User = await this.getUserByUsername(username);
		if (sender && receiver)
			await this.userService.acceptFriend(sender, receiver);
	}

	@Delete("/friends/deny")
	async denyFriend(@Req() req: Request, @Body("username") username: string): Promise<void> {
		const receiver: User = await this.getMe(req);
		const sender: User = await this.getUserByUsername(username);
		await this.userService.denyFriend(receiver, sender);
	}

	@Delete("/friends/remove")
	async removeFriend(@Req() req: Request, @Body("username") username: string): Promise<void> {
		const user: User = await this.getMe(req);
		const friend: User = await this.getUserByUsername(username);
		await this.userService.removeFriend(user, friend);
	}

	//~~ BLACKLIST
	@Post("/blacklist/add")
	async addBlacklist(@Req() req: Request, @Body("username") username: string): Promise<void> {
		const user: User = await this.getMe(req);
		const userToUnblock: User = await this.getUserByUsername(username);
		await this.userService.addBlacklist(user, userToUnblock);
	}

	@Delete("/blacklist/remove")
	async removeBlacklist(@Req() req: Request, @Body("username") username: string): Promise<void> {
		const user: User = await this.getMe(req);
		const blockedUser: User = await this.getUserByUsername(username);
		await this.userService.removeBlacklist(user, blockedUser);
	}
}
