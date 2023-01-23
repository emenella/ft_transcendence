import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { User } from "./User.entity";
import { UserService } from "./User.service";

@Controller("users")
export class UserControllers {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<User> {
        return this.userService.getUserById(id);
    }

    @Post()
    async create(@Body() user: User): Promise<void> {
        return this.userService.createUser(user);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() user: User): Promise<void> {
        return this.userService.updateUser(id, user);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.userService.deleteUser(id);
    }


}