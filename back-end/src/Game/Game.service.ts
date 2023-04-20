import { Injectable } from "@nestjs/common";
import { Game } from "./modele/Game.modele";
import { Setup, GameInfo } from "./interface/Game.interface";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import { User } from "../User/entity/User.entity";
import { player, ball, general } from "./interface/Game.interface";

@Injectable()
export class GameService {
    private games: Map<string, Game> = new Map();
    private users: Map<number, Game> = new Map();
    private spectators: Map<number, Game> = new Map();
    private request: Array<{ from: number, to: number }> = [];

    private setup: general = {
            id: null,
            ScoreWin: 5,
            Overtime: true,
            OvertimeScore: 3,
            height: 1080,
            width: 1920,
    };

    private setupBall: ball = {
        color: "green",
        radius: 20,
        speed: 5,
        maxSpeed: 20
    };

    constructor() {
    }

    public getGame(id: string): Game | undefined {
        return this.games.get(id);
    }

    public getGames(): Map<string, Game> {
        return this.games;
    }

    public deleteGame(id: string): void {
        this.handlerGameFinish(id);
        this.games.delete(id);
    }

    public createGame(setting: Setup, handleEnd?: (id: string) => Promise<void>): Game {
        let game: Game;
        const id = uuidv4();
        const setup: Setup = setting;
        const handler: (id: string) => Promise<void> = handleEnd ? handleEnd : this.handlerGameFinish.bind(this);
        setup.general.id = id;
        game = new Game(setup, handler);
        this.games.set(id, game);
        return game;
    }

    public joinPlayer(gameId: string, userId: number, socket: Socket): boolean {
        let game = this.games.get(gameId);
        if (game && !this.users.has(userId)) {
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
                games.push(game.getSetup().general.id as string);
            }
        }
        return games;
    }

    public findGamesId(id: string): string | undefined {
        for (const game of this.games.values()) {
            if (game.getSetup().general.id == id) {
                return game.getSetup().general.id as string;
            }
        }
        return undefined;
    }

    public handleGameEvent(userId: number, event: string): void {
        let game = this.users.get(userId);
        if (game) {
            game.handleEvent(userId, event);
        }
    }

    public getGameSetup(userId: number): Setup | undefined {
        let game = this.users.get(userId);
        if (game) {
            return game.getSetup();
        }
        else
            return undefined;
    }

    public getGameInfo(userId: number): GameInfo | undefined {
        let game = this.users.get(userId);
        if (game) {
            return game.getGameInfo();
        }
        else
            return undefined;
    }

    public spectateGame(matchId: string, userId: number, socket: Socket): boolean {
        let game = this.games.get(matchId);
        if (game) {
            this.spectators.set(userId, game);
            game.spectatorConnect(userId, socket);
            return true;
        }
        else {
            return false
        }
    }

    public leaveSpectator(userId: number): boolean {
        let game = this.spectators.get(userId);
        if (game) {
            game.spectatorDisconnect(userId);
            this.spectators.delete(userId);
            return true;
        }
        else {
            return false
        }
    }

    public async handlerGameFinish(gameId: string): Promise<void>
    {
        let game = this.games.get(gameId);
        if (game)
        {
            this.users.delete(game.getSetup().player0.id as number);
            this.users.delete(game.getSetup().player1.id as number);
            this.games.delete(gameId);
        }
    }

    public isPlayer(client: Socket): {gameId: string, isPlayer:boolean} | undefined {
        for (const game of this.users.values()) {
            const ids = game.getSocketId();
            for (const id of ids) {
                if (id == client.id) {
                    return {gameId: game.getSetup().general.id as string, isPlayer: game.isPlayer(client)};
                }
            }
        }
        return undefined;
    }

    public async requestGametoUser(from: User, to: User): Promise<number> {
        if (this.request.find((req) => req.from == from.id && req.to == to.id)) {
        this.request.push({ from: from.id, to: to.id });
        console.log(this.request.length - 1);
        return this.request.length - 1;
        }
        return -1;
    }

    public async acceptRequest(id: number, from: User, user: User): Promise<boolean> {
        if (this.request[id] && this.request[id].from == from.id) {
            const setup: Setup = await this.createSetup(from, user);
            console.log(setup);
            this.createGame(setup, this.handlerGameFinish.bind(this));
            this.request.splice(id, 1);
            return true;
        }
        return false;
    }

    public getPlayerSetup(user: User): player {
        const player: player = {
            id: user.id,
            username: user.username,
            color: user.color,
            length: 150,
            width: 10,
            speedX: 0,
            speedY: 5
        };
        return player;
    }

    async createSetup(user1: User, user2: User): Promise<Setup> {
        const setup: Setup = {
            general: this.setup,
            player0: this.getPlayerSetup(user1),
            player1: this.getPlayerSetup(user2),
            ball: this.setupBall,
        };
        return setup;
    }
}