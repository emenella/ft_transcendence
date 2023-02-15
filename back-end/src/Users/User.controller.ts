import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { User } from "./entity/User.entity";
import { UserService } from "./service/User.service";

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
    async create(@Body() user: User): Promise<User> {
        return this.userService.createUser(user);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() user: User): Promise<User> {
        return this.userService.updateUser(id, user);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.userService.deleteUser(id);
    }


}