import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query, UseInterceptors, UploadedFile } from "@nestjs/common";
import { User } from "./entity/User.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./service/User.service";


@Controller("users")
export class UserControllers {
    constructor(private readonly userService: UserService) {}

    @Get("/me/")
    async getMe(@Req() req : any): Promise<User> {
        return req.user;
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
    async updateUser(@Req() req : any, @Body("username") username: string): Promise<User> {
        const user: User = await this.getMe(req);
        console.log(username);
        return this.userService.updateUsername(user.id, username);
    }

    @Post("/upload/avatar/")
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file, @Req() req: any): Promise<string> {
        const user: User = await this.getMe(req);
        console.log(file);
        return await this.userService.uploadAvatar(user.id, file);
    }
}