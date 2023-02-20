import { Injectable } from "@nestjs/common";
import { Game, Setup } from "./modele/Game.modele";

@Injectable()
export class GameService {
    private games: Map<string, Game> = new Map();

    private setup: Setup = {
        general: {
            ScoreWin: 5,
            Overtime: false,
        },
        player0: {
            name: "Player 0",
            color: "red",
            length: 100,
            width: 10,
            speedX: 0,
            speedY: 5
        },
        player1: {
            name: "Player 1",
            color: "blue",
            length: 100,
            width: 10,
            speedX: 0,
            speedY: 5
        },
        ball: {
            color: "green",
            radius: 10,
            speed: 10
        },
        server: { url: undefined }
    };

    public getGame(id: string): any {
        return this.games.get(id);
    }

    public createGame(): Game {
        const game = new Game();
        this.games.set(game.id, game);
        return game;
    }
}