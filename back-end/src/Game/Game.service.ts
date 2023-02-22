import { Injectable } from "@nestjs/common";
import { Game, Setup } from "./modele/Game.modele";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";

@Injectable()
export class GameService {
    private games: Map<string, Game> = new Map();

    private default: Setup = {
        general: {
            ScoreWin: 5,
            Overtime: false,
            OvertimeScore: 3,
            height: 1000,
            width: 2000
        },
        player0: {
            id: 1,
            color: "red",
            length: 100,
            width: 10,
            speedX: 0,
            speedY: 5
        },
        player1: {
            id: 2,
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
    };

    constructor() {
        this.createGame(this.default);
    }

    public getGame(id: string): any {
        return this.games.get(id);
    }

    public createGame(setting?: Setup): Game {
        let game: Game;
        if (setting)
            game = new Game(setting);
        else
            game = new Game(this.default);
        this.games.set(uuidv4(), game);
        return game;
    }

    public joinPlayer(id: number, socket: Socket): boolean {
        let game = this.findGameWithPlayer(id);
        if (game) {
            return game.playerConnect(id, socket);
        }
        else {
            return false
        }
    }

    public leavePlayer(id: number): boolean {
        let game = this.findGameWithPlayer(id);
        if (game) {
            return game.playerDisconnect(id);
        }
        else {
            return false
        }
    }

    protected findGameWithPlayer(id: number): Game {
        for (const game of this.games.values()) {
            if (game.player0.id === id || game.player1.id === id) {
                return game;
            }
        }
        return null;
    }

    public handleGameEvent(id: number, event: string): void {
        let game = this.findGameWithPlayer(id);
        if (game) {
            game.handleEvent(id, event);
        }
    }

    public getGameSetup(id: number): Setup {
        let game = this.findGameWithPlayer(id);
        if (game) {
            return game.getSetup();
        }
        else
            return null;
    }

    public spectateGame(gameid: string, userid: number, socket: Socket): boolean {
        let game = this.games.get(gameid)
        if (game) {
            game.spectatorConnect(userid, socket);
            return true;
        }
        else {
            return false
        }
    }
}