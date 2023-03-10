import { Controller, Get, Post, Body, Req, Query, UseInterceptors, UploadedFile, Delete } from "@nestjs/common";
import { Request } from "express";
import { User } from "./entity/User.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./service/User.service";


@Controller("users")
export class UserControllers {
    constructor(private readonly userService: UserService) {}
    
    @Get("/me/")
    async getMe(@Req() req : Request): Promise<User> {
        return req.user as User;
    }
    
    @Get("/")
    async getUser(): Promise<User[]> {
        return this.userService.getAllUsers();
    }
    
    @Get("/id/")
    async getUserById(@Query('id') id: number): Promise<User> {
        return this.userService.getUserById(id);
    }
    
    @Get("/username/")
    async getUserByLogin(@Query('username') username: string): Promise<User> {
        return this.userService.getUserByLogin(username);
    }
    
    @Post("/me/")
    async updateUser(@Req() req : Request, @Body("username") username: string): Promise<User> {
        const user: User = await this.getMe(req);
        console.log(username);
        return this.userService.updateUsername(user.id, username);
    }
    
    @Get("/friends/")
    async getFriends(@Req() req: Request): Promise<User[]> {
        const user: User = await this.getMe(req);
        return this.userService.getFriends(user);
    }
    
    @Post("/friends/add")
    async addFriend(@Req() req: Request, @Query('friendId') friendId: number): Promise<void> {
        const user: User = await this.getMe(req);
        console.log("addFriend " + friendId + " to " + user.id);
        const friend: User = await this.getUserById(friendId);
        await this.userService.addFriend(user, friend);
    }
    
    @Delete("/friends/remove")
    async removeFriend(@Req() req: Request, @Query('friendId') friendId: number): Promise<void> {
        const user: User = await this.getMe(req);
        const friend: User = await this.getUserById(friendId);
        await this.userService.removeFriend(user, friend);
    }
    
    @Get("/blacklist/")
    async getBlacklist(@Req() req: Request): Promise<User[]> {
        const user: User = await this.getMe(req);
        return this.userService.getBlacklist(user);
    }
    
    @Post("/blacklist/add")
    async addBlacklist(@Req() req: Request, @Query('userToBlacklistId') userToBlacklistId: number): Promise<void> {
        const user: User = await this.getMe(req);
        const userToBlacklist: User = await this.getUserById(userToBlacklistId);
        await this.userService.addBlacklist(user, userToBlacklist);
    }
    
    @Delete("/blacklist/remove")
    async removeBlacklist(@Req() req: Request, @Query('userToBlacklistId') userToBlacklistId: number): Promise<void> {
        const user: User = await this.getMe(req);
        const userToBlacklist: User = await this.getUserById(userToBlacklistId);
        await this.userService.removeBlacklist(user, userToBlacklist);
    }
    
    @Post("/upload/avatar/")
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<string> {
        const user: User = await this.getMe(req);
        console.log(file);
        return await this.userService.uploadAvatar(user.id, file);
    }
}