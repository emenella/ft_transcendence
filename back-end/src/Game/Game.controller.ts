import { Controller, Get, Post } from "@nestjs/common";
import { GameService } from "./Game.service";

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    //get all games
    @Get('')
    async getGame() {
        return this.gameService.getGames();
    }

    //get player in queue
    @Get('matchmaking')
    async getMatchmaking() {
        
    }

    //Create Duel 
    @Post('duel')
    async createGame() {
        return this.gameService.createGame();
    }

}