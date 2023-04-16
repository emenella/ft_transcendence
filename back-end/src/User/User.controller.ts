import { Controller, Get, Post, Body, Req, Query, UseInterceptors, UploadedFile, Delete } from "@nestjs/common";
import { Request } from "express";
import { User } from "./entity/User.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./service/User.service";
import { Match } from './entity/Match.entity';


@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Get("/me")
    async getMe(@Req() req : Request): Promise<User> {
		return req.user as User;
    }
    
    @Get("/id")
    async getUserById(@Query('id') id: number): Promise<User> {
		return this.userService.getUserById(id);
    }
    
    @Get("/username")
    async getUserByUsername(@Query('username') username: string): Promise<User> {
		return this.userService.getUserByUsername(username);
    }

	@Get("/all")
	async getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}
	
	//~~ GET INFO
    @Get("/match_history")
    async getMatchHistory(@Query('id') id: number): Promise<Match[]> {
		const player: User = await this.getUserById(id);
        return this.userService.getMatchHistory(player);
    }

	//~~ SET INFO
    @Post("/me")
    async updateUser(@Req() req : Request, @Body("username") username: string): Promise<User> {
        const user: User = await this.getMe(req);
        return this.userService.updateUsername(user.id, username);
    }

    @Post("/avatar/upload")
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<string> {
        const user: User = await this.getMe(req);
        return await this.userService.uploadAvatar(user.id, file);
    }

	@Post("/status")
	async updateStatus(@Req() req: Request, @Query('status') status: number): Promise<void> {
        const user: User = await this.getMe(req);
		this.userService.changeStatus(user, status);
	}

	//~~FRIENDS
	@Post("/friends/invite")
    async inviteFriend(@Req() req: any, @Query('username') username: string): Promise<void> {
        const user: User = await this.getMe(req);
		const friend: User = await this.getUserByUsername(username);
        this.userService.inviteFriend(user, friend);
    }
	
	@Post("/friends/accept")
	async acceptFriend(@Req() req: any, @Query('username') username: string): Promise<void> {
		const user: User = await this.getMe(req);
		const friend: User = await this.getUserByUsername(username);
		this.userService.acceptFriend(user, friend);
	}

	@Delete("/friends/deny")
    async denyFriend(@Req() req: any, @Query('username') username: string): Promise<void> {
        const user: User = await this.getMe(req);
		const friend: User = await this.getUserByUsername(username);
        this.userService.denyFriend(user, friend);
    }
    
    @Delete("/friends/remove")
    async removeFriend(@Req() req: Request, @Query('username') username: string): Promise<void> {
        const user: User = await this.getMe(req);
        const friend: User = await this.getUserByUsername(username);
        await this.userService.removeFriend(user, friend);
    }

	//~~ BLACKLIST
    @Post("/blacklist/add")
    async addBlacklist(@Req() req: Request, @Query('username') username: string): Promise<void> {
        const user: User = await this.getMe(req);
        const userToBlacklist: User = await this.getUserByUsername(username);
        await this.userService.addBlacklist(user, userToBlacklist);
    }
    
    @Delete("/blacklist/remove")
    async removeBlacklist(@Req() req: Request, @Query('username') username: string): Promise<void> {
        const user: User = await this.getMe(req);
        const userToBlacklist: User = await this.getUserByUsername(username);
        await this.userService.removeBlacklist(user, userToBlacklist);
    }
}