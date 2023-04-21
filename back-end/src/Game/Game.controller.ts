import { Controller, Get, Post, Req, Query, Body } from "@nestjs/common";
import { GameService } from "./Game.service";
import { Request } from "express";
import { UserService } from "../User/service/User.service";
import { User } from "../User/entity/User.entity";

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService,
                private readonly userService: UserService) {}

    @Get()
    getGames() {
        return this.gameService.getGames();
    }

    @Get(':id')
    getGameById(req: Request) {
        const id = req.params.id;
        return this.gameService.findGamesId(id);
    }

    //Duel
    @Post('/duel/request')
    async requestDuel(@Req() req: Request, @Body("id") id: any) {
        const user = req.user as User;
        const to: User = await this.userService.getUserById(id);
        if (user) {
            const ret = await this.gameService.requestGametoUser(user, to);
            if (ret) {
                return true;
            }
        }
        return false;
    }

    @Post('duel/accept/:id')
    async acceptDuel(req: Request, @Query('id') id: number) {
        const from = await this.userService.getUserById(id);
        const user = req.user as User;
        if (user) {
            const ret = await this.gameService.acceptRequest(id, from, user);
            if (ret) {
                return true;
            }
        }
        return false;
    }

}