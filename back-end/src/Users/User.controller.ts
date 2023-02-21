import { Controller, Get, Post, Put, Delete, Body, Param, Req } from "@nestjs/common";
import { User } from "./entity/User.entity";
import { UserService } from "./service/User.service";

@Controller("users")
export class UserControllers {
    constructor(private readonly userService: UserService) {}

    @Get("/me/")
    async getMe(@Req() req : any): Promise<User> {
        return this.userService.getUserFromConnectionId(req.user.userId);
    }

    
}