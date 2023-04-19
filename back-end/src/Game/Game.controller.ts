import { Controller, Get } from "@nestjs/common";
import { GameService } from "./Game.service";
import { Request } from "express";

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    // get all games
    @Get()
    getGames() {
        return this.gameService.getGames();
    }

    // get game by id
    @Get(':id')
    getGameById(req: Request) {
        const id = req.params.id;
        return this.gameService.findGamesId(id);
    }
}