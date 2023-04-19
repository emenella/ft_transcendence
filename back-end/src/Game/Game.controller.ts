import { Controller, Get, Post, Query } from "@nestjs/common";
import { GameService } from "./Game.service";
import { Request } from "express";
import { UserService } from "../User/service/User.service";
import { User } from "../User/entity/User.entity";

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService, private readonly userService: UserService) {}

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
    @Post('duel/request/:id')
    async requestDuel(req: Request, @Query('id') id: number) {
        const to: User = await this.userService.getUserById(id);
        const user = req.user as User;
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
        console.log(req.params.id, req.user as User);
        const user = req.user as User;
        if (user) {
            const ret = await this.gameService.acceptRequest(id, user);
            if (ret) {
                return true;
            }
        }
        return false;
    }

    @Post('duel/decline/:id')
    async declineDuel(req: Request, @Query('id') id: number) {
        const user = req.user as User;
        if (user) {
            const ret = await this.gameService.declineRequest(id, user);
            if (ret) {
                return true;
            }
        }
        return false;
    }

}