import { Injectable } from "@nestjs/common";
import { Game } from "./modele/Game.modele";
import { Setup, GameInfo } from "./interface/Game.interface";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";

@Injectable()
export class GameService {
    private games: Map<string, Game> = new Map();
    private users: Map<number, Game> = new Map();

    private default: Setup = {
        general: {
            id: null,
            ScoreWin: 5,
            Overtime: true,
            OvertimeScore: 3,
            height: 1000,
            width: 1000,
        },
        player0: {
            id: 1,
            username: "Player 1",
            color: "red",
            length: 100,
            width: 10,
            speedX: 0,
            speedY: 5
        },
        player1: {
            id: 2,
            username: "Player 2",
            color: "blue",
            length: 100,
            width: 10,
            speedX: 0,
            speedY: 5
        },
        ball: {
            color: "green",
            radius: 20,
            speed: 10,
            maxSpeed: 20
        },
    };

    constructor() {
        this.createGame();
    }

    public getGame(id: string): Game {
        return this.games.get(id);
    }

    public deleteGame(id: string): void {
        this.games.delete(id);
    }

    public createGame(setting?: Setup, handleEnd?: (id: string) => Promise<void>): Game {
        let game: Game;
        const id = uuidv4();
        const setup: Setup = setting ? setting : this.default;
        const handler: (id: string) => Promise<void> = handleEnd ? handleEnd : this.handlerGameFinish;
        setup.general.id = id;
        game = new Game(setup, handler);
        this.games.set(id, game);
        return id;
    }

    public joinPlayer(gameId: string, userId: number, socket: Socket): boolean {
        let game = this.games.get(gameId);
        console.log("join player "+userId+" to game "+gameId);
        if (game) {
            this.users.set(userId, game);
            return game.playerConnect(userId, socket);
        }
        else {
            return false
        }
    }

    public setPlayerReady(userId: number): boolean {
        let game = this.users.get(userId);
        if (game) {
            return game.playerReady(userId);
        }
        else {
            return false
        }
    }

    public leavePlayer(userId: number): boolean {
        let game = this.users.get(userId);
        if (game) {
            this.users.delete(userId);
            return game.playerDisconnect(userId);
        }
        else {
            return false
        }
    }

    public findGamesIdWithPlayer(id: number): Array<string> {
        let games: Array<string> = [];
        for (const game of this.games.values()) {
            if (game.getSetup().player0.id == id || game.getSetup().player1.id == id) {
                games.push(game.getSetup().general.id);
            }
        }
        return games;
    }

    public handleGameEvent(userId: number, event: string): void {
        let game = this.users.get(userId);
        if (game) {
            game.handleEvent(userId, event);
        }
    }

    public getGameSetup(userId: number): Setup {
        let game = this.users.get(userId);
        if (game) {
            return game.getSetup();
        }
        else
            return null;
    }

    public getGameInfo(userId: number): GameInfo {
        let game = this.users.get(userId);
        if (game) {
            return game.getGameInfo();
        }
        else
            return null;
    }

    public spectateGame(matchId: string, userId: number, socket: Socket): boolean {
        let game = this.games.get(matchId);
        if (game) {
            game.spectatorConnect(userId, socket);
            return true;
        }
        else {
            return false
        }
    }

    public async handlerGameFinish(gameId: string): Promise<void>
    {
        let game = this.games.get(gameId);
        console.log("game finish "+gameId);
        if (game)
        {
            this.games.delete(gameId);
        }
    }
}