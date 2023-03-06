import { Injectable } from "@nestjs/common";
import { GameService } from "src/Game/Game.service";
import { UserService } from "src/Users/service/User.service";
import { Game } from "src/Game/modele/Game.modele";
import { User } from "src/Users/entity/User.entity";
import { Setup, general, ball, player } from "../interface/Game.interface";
import { updateElo, checkMatch, Result } from "./utils/elo.utils";
import { MatchHistory } from "src/Users/entity/History.entity";
import { HistoryService } from "src/Users/service/History.service";
import { Socket } from "socket.io";


@Injectable()
export class MatchmakingService {
    private sockets: Map<number, Socket> = new Map();
    private queue: Array<User> = new Array();
    private setup: general = {
        id: null,
        ScoreWin: 5,
        Overtime: true,
        OvertimeScore: 3,
        height: 1000,
        width: 1000
    };

    private ball: ball = {
        color: "green",
        radius: 20,
        speed: 10,
        maxSpeed: 20
    };

    constructor(private readonly gameService: GameService, private readonly userService: UserService,
        private readonly historyService: HistoryService) { }

    async joinQueue(user: User, client: Socket): Promise<boolean> {
        if (this.queue.includes(user))
            return false;
        this.queue.push(user);
        this.sockets.set(user.id, client);
        this.foundMatch();
        return true;
    }

    async leaveQueue(user: User): Promise<boolean> {
        if (!this.queue.includes(user))
            return false;
        this.queue.splice(this.queue.indexOf(user), 1);
        this.foundMatch();
        return true;
    }

    public getQueue(): Array<User> {
        return this.queue;
    }

    public getGame(id: string): Game {
        return this.gameService.getGame(id);
    }

    public deleteGame(id: string): void {
        this.gameService.deleteGame(id);
    }

    async getPlayerSetup(user: User): Promise<player> {
        const player: player = {
            id: user.id,
            username: user.username,
            color: "red",
            length: 100,
            width: 10,
            speedX: 0,
            speedY: 5
        };
        return player;
    }

    async createSetup(user1: User, user2: User): Promise<Setup> {
        const setup: Setup = {
            general: this.setup,
            player0: await this.getPlayerSetup(user1),
            player1: await this.getPlayerSetup(user2),
            ball: this.ball,
        };
        return setup;
    }

    async createGame(user1: User, user2: User): Promise<Game> {
        const setup: Setup = await this.createSetup(user1, user2);
        const game: Game = await this.gameService.createGame(setup, this.handleEndGame.bind(this));
        return game;
    }

    async getGameFromUser(user: User): Promise<Game[]> {
        const ids = this.gameService.findGamesIdWithPlayer(user.id);
        const games: Game[] = [];
        for (const id of ids) {
            const game = await this.gameService.getGame(id);
            games.push(game);
        }
        return games;
    }

    public changeBallColor(color: string): boolean {
        this.ball.color = color;
        return true;
    }

    public changeBallRadius(radius: number): boolean {
        this.ball.radius = radius;
        return true;
    }

    public changeBallSpeed(speed: number): boolean {
        this.ball.speed = speed;
        return true;
    }

    public changeScoreWin(score: number): boolean {
        this.setup.ScoreWin = score;
        return true;
    }

    public changeOvertime(overtime: boolean): boolean {
        this.setup.Overtime = overtime;
        return true;
    }

    public changeOvertimeScore(score: number): boolean {
        this.setup.OvertimeScore = score;
        return true;
    }

    public changeHeight(height: number): boolean {
        this.setup.height = height;
        return true;
    }

    public changeWidth(width: number): boolean {
        this.setup.width = width;
        return true;
    }

    private async foundMatch(): Promise<boolean> {
        const bestMatch = checkMatch(this.queue);
        if (bestMatch) {
            const game: Game = await this.createGame(bestMatch[0], bestMatch[1]);
            this.leaveQueue(bestMatch[0]);
            this.leaveQueue(bestMatch[1]);
            return true;
        }
        return false;
    }

    public async handleEndGame(id: string): Promise<void> {
        const game = await this.gameService.getGame(id);
        const score: Array<number> = game.getScore();
        const ids: Array<number> = game.getPlayersId();
        const user0: User = await this.userService.getUserById(ids[0]);
        const user1: User = await this.userService.getUserById(ids[1]);
        if (score[0] > score[1]) {
            user0.elo = updateElo(user0, user1, Result.WIN);
            user1.elo = updateElo(user1, user0, Result.LOSE);
        }
        else if (score[0] < score[1]) {
            user0.elo = updateElo(user0, user1, Result.LOSE);
            user1.elo = updateElo(user1, user0, Result.WIN);
        }
        else {
            user0.elo = updateElo(user0, user1, Result.DRAW);
            user1.elo = updateElo(user1, user0, Result.DRAW);
        }
        await this.userService.updateUser(user0.id, user0);
        await this.userService.updateUser(user1.id, user1);
        await this.createMatchHistory(id, score[0] > score[1] ? user0 : user1, score[0] < score[1] ? user0 : user1);
        this.gameService.deleteGame(id);
    }

    private async createMatchHistory(id: string, winner: User, looser: User): Promise<void> {
        const game: Game = await this.gameService.getGame(id);
        const score: Array<number> = game.getScore();
        const ids: Array<number> = game.getPlayersId();
        const history: MatchHistory = new MatchHistory();
        history.winner = winner;
        history.looser = looser;
        history.scores = [ids[0] === winner.id ? score[0] : score[1], ids[0] === looser.id ? score[0] : score[1]];
        history.date = new Date();
        await this.historyService.addHistory(history);
    }


}