import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query, UseInterceptors, UploadedFile } from "@nestjs/common";
import { User } from "./entity/User.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./service/User.service";
import { diskStorage } from "multer";
import { filenameFunc, filterAvatar } from "./utils/multer.utils";


@Controller("users")
export class UserControllers {
    constructor(private readonly userService: UserService) {}

    @Get("/me/")
    async getMe(@Req() req : any): Promise<User> {
        return this.userService.getUserFromConnectionId(req.user.userId);
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
    async updateUser(@Req() req : any, @Body() body: User): Promise<User> {
        const user: User = await this.getMe(req);
        return this.userService.updateUsername(user.id, body);
    }

    @Post("/upload/avatar/")
    @UseInterceptors(FileInterceptor('image', { storage: diskStorage({ destination: './uploads', filename: filenameFunc }), fileFilter: filterAvatar }))
    async uploadAvatar(@UploadedFile() file, @Req() req: any): Promise<void> {
        const user: User = await this.getMe(req);
        await this.userService.uploadAvatar(user.id, file);
    }
}