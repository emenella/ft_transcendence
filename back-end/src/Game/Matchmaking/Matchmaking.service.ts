import { HttpException, Inject, Injectable, forwardRef, HttpStatus } from "@nestjs/common";
import { GameService } from "../../Game/Game.service";
import { UserService } from "../../User/service/User.service";
import { Game } from "../../Game/modele/Game.modele";
import { User } from "../../User/entity/User.entity";
import { Setup, general, ball, player } from "../interface/Game.interface";
import { updateElo, checkMatch, Result } from "./utils/elo.utils";
import { Match } from "../../User/entity/Match.entity";
import { MatchService } from "../../User/service/Match.service";
import { SocketService } from "../../Socket/Socket.service";
import { SockEvent } from "../../Socket/Socket.gateway";


@Injectable()
export class MatchmakingService {
    //private sockets: Map<number, Socket> = new Map<number, Socket>();
    private queue: Array<number> = new Array();
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
        speed: 5,
        maxSpeed: 20
    };

    constructor(private readonly gameService: GameService, @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly historyService: MatchService, private readonly socketService: SocketService) { }

    async joinQueue(user: User): Promise<boolean> {
        if (this.queue.includes(user.id) || await this.isInGame(user.id))
            return false;
        this.queue.push(user.id);
        await this.foundMatch().catch(err => console.log(err));
        return true;
    }

    async leaveQueue(user: User): Promise<boolean> {
        if (!this.queue.includes(user.id))
            return false;
        this.queue.splice(this.queue.indexOf(user.id), 1);
        await this.foundMatch().catch(err => console.log(err));
        return true;
    }

    public getQueue(): Array<number> {
        return this.queue;
    }

    public getGame(id: string): Game | undefined {
        return this.gameService.getGame(id);
    }

    public deleteGame(id: string): void {
        this.gameService.deleteGame(id);
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
            ball: this.ball,
        };
        return setup;
    }

    async createGame(user1: User, user2: User): Promise<Game> {
        const setup: Setup = await this.createSetup(user1, user2);
        const game: Game = await this.gameService.createGame(setup, this.handleEndGame.bind(this));
        return game;
    }

    async getGameFromUser(user: number): Promise<Game[]> {
        const ids = this.gameService.findGamesIdWithPlayer(user);
        const games: Game[] = [];
        for (const id of ids) {
            const game = this.gameService.getGame(id);
            if (game)
                games.push(game);
        }
        return games;
    }

    async isInGame(user: number): Promise<boolean> {
        const games = await this.getGameFromUser(user);
        return games.length > 0;
    }

    public changeBallColor(color: string): void {
        this.ball.color = color;
    }

    public changeBallRadius(radius: number): void {
        this.ball.radius = radius;
    }

    public changeBallSpeed(speed: number): void {
        this.ball.speed = speed;
    }

    public changeScoreWin(score: number): void {
        this.setup.ScoreWin = score;
    }

    public changeOvertime(overtime: boolean): void {
        this.setup.Overtime = overtime;
    }

    public changeOvertimeScore(score: number): void {
        this.setup.OvertimeScore = score;
    }

    public changeHeight(height: number): void {
        this.setup.height = height;
    }

    public changeWidth(width: number): void {
        this.setup.width = width;
    }

    private async foundMatch(): Promise<boolean> {
        const users: User[] = [];
        for (const id of this.queue) {
            const user = await this.userService.getUserById(id);
            if (user)
                users.push(user);
        }
        const bestMatch = checkMatch(users);
        if (bestMatch) {
            const game: Game = await this.createGame(bestMatch.user0, bestMatch.user1);
            let socket0 = this.socketService.getSocketByUserId(bestMatch.user0.id);
            let socket1 = this.socketService.getSocketByUserId(bestMatch.user1.id);
            if (socket0 && socket1) {
                socket0.emit(SockEvent.SE_MM_FOUND, game.getSetup().general.id);
                socket1.emit(SockEvent.SE_MM_FOUND, game.getSetup().general.id);
            }
            await this.leaveQueue(bestMatch.user0);
            await this.leaveQueue(bestMatch.user1);
            return true;
        }
        return false;
    }

    public async handleEndGame(id: string): Promise<void> {
        const game = this.gameService.getGame(id);
        if (!game)
            throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
        const score: Array<number> = game.getScore();
        const ids: Array<number> = game.getPlayersId();
        let user0: User = await this.userService.getUserById(ids[0]);
        let user1: User = await this.userService.getUserById(ids[1]);
        let tmpUsers: Array<number> = [user0.elo, user1.elo];
        if (score[0] > score[1]) {
            user0.elo = Math.round(updateElo(tmpUsers[0], tmpUsers[1], Result.WIN));
            user1.elo = Math.round(updateElo(tmpUsers[1], tmpUsers[0], Result.LOSE));
        }
        else if (score[0] < score[1]) {
            user0.elo = Math.round(updateElo(tmpUsers[0], tmpUsers[1], Result.LOSE));
            user1.elo = Math.round(updateElo(tmpUsers[1], tmpUsers[0], Result.WIN));
        }
        else {
            user0.elo = Math.round(updateElo(tmpUsers[0], tmpUsers[1], Result.DRAW));
            user1.elo = Math.round(updateElo(tmpUsers[1], tmpUsers[0], Result.DRAW));
        }
        await this.userService.updateUser(user0.id, user0);
        await this.userService.updateUser(user1.id, user1);
        await this.createMatchHistory(id, score[0] > score[1] ? user0 : user1, score[0] < score[1] ? user0 : user1);
        await this.gameService.handlerGameFinish(id);
    }

    private async createMatchHistory(id: string, winner: User, loser: User): Promise<void> {
        const game = this.gameService.getGame(id);
        if (!game)
            throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
        const score: Array<number> = game.getScore();
        const ids: Array<number> = game.getPlayersId();
        const history: Match = new Match();
        history.winner = winner;
        history.loser = loser;
        history.scores = [ids[0] === winner.id ? score[0] : score[1], ids[0] === loser.id ? score[0] : score[1]];
        history.date = new Date();
        await this.historyService.addMatch(history);
    }

    // public addSocket(user: User, socket: Socket): void {
    //     if (this.sockets.has(user.id))
    //         this.sockets.delete(user.id);
    //     this.sockets.set(user.id, socket);
    // }

    // public removeSocket(user: User): void {
    //     this.sockets.delete(user.id);
    // }

    // public isConnect(user: User): boolean {
    //     return this.sockets.has(user.id);
    // }

    // public getSocket(user: User): Socket {
    //     return this.sockets.get(user.id) as Socket;
    // }

}