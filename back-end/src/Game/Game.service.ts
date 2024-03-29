import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Game } from "./modele/Game.modele";
import { Setup, GameInfo } from "./interface/Game.interface";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import { User } from "../User/entity/User.entity";
import { player, ball, general } from "./interface/Game.interface";
import { UserService, UserStatus } from "../User/service/User.service";
import { Player } from "./modele/Player.modele";

@Injectable()
export class GameService {
    private games: Map<string, Game> = new Map();
    private users: Map<number, Game> = new Map();
    private spectators: Map<number, Game> = new Map();

    private setup: general = {
            id: null,
            ScoreWin: 5,
            Overtime: true,
            OvertimeScore: 3,
            height: 1000,
            width: 1000,
    };

    private setupBall: ball = {
        color: "green",
        radius: 20,
        speed: 10,
        maxSpeed: 20
    };

    constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {
    }

    public getGame(id: string): Game | undefined {
        return this.games.get(id);
    }

    public getGames(): Map<string, Game> {
        return this.games;
    }

    public deleteGame(id: string): void {
        this.handlerGameFinish(id, null, null);
        this.games.delete(id);
    }

    public async createGame(setting: Setup, handleEnd?: (id: string, winner: Player, looser: Player) => Promise<void>): Promise<Game> {
        let game: Game;
        const id = uuidv4();
        const setup: Setup = setting;
        const handler: (id: string, winner: Player, looser: Player) => Promise<void> = handleEnd ? handleEnd : this.handlerGameFinish.bind(this);
        setup.general.id = id;
        game = new Game(setup, handler);
        this.games.set(id, game);
        return game;
    }

    public async joinPlayer(gameId: string, userId: number, socket: Socket): Promise<boolean> {
        let game = this.games.get(gameId);
        if (game && !this.users.has(userId)) {
            this.users.set(userId, game);
            const ret = game.playerConnect(userId, socket);
            if (ret)
            {
                const player0: User = await this.userService.getUserById(userId);
                await this.userService.changeStatus(player0, UserStatus.InGame);
                return true;
            }
        }
        return false;
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

    public async handlerGameFinish(gameId: string, winner: Player, looser: Player): Promise<void>
    {
        let game = this.games.get(gameId);
        if (game)
        {
            const player0 = await this.userService.getUserById(game.getSetup().player0.id);
            const player1 = await this.userService.getUserById(game.getSetup().player1.id);
            await this.userService.changeStatus(player0, UserStatus.Connected);
            await this.userService.changeStatus(player1, UserStatus.Connected);
            this.users.delete(player0.id);
            this.users.delete(player1.id);
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

    public interpolatePosition(user: User, data: any): void {
        const game = this.users.get(user.id);
        if (game) {
            game.interpolatePosition(user.id, data);
        }
    }
}