import { Player, Direction } from "./Player.modele";
import { Ball } from "./Ball.modele";
import { Socket } from "socket.io";
import { Spectator } from "./Spec.modele";
import { GameInfo, Setup } from "../interface/Game.interface";

export class Game {
    
    private player0: Player;
    private player1: Player;
    private spectators: Spectator[] = [];
    private isLive: boolean;
    private isFinish: boolean;
    private ball: Ball;
    private startSpeed: number;
    private setup: Setup;

    constructor(_setup: Setup, readonly handlerGameFinish: (id: string, winner: Player, looser: Player) => Promise<void>)
    {
        this.setup = _setup;
        this.startSpeed = this.setup.ball.speed;
        this.player0 = new Player(this.setup.player0.id, this.setup, 10, this.setup.general.height / 2);
        this.ball = new Ball(this.setup);	
        this.player1 = new Player(this.setup.player1.id, this.setup, this.setup.general.width - 10 - this.setup.player1.width, this.setup.general.height / 2);
        this.isLive = false;
        this.isFinish = false;
        this.launchGame();
    }
    
    private loop(): void
    {
        if (!this.isFinish)
        {
            if (this.isLive)	
            {
                this.ball.move(this.player0, this.player1, this.sendGameInfo.bind(this));
                this.player0.move();
                this.player1.move();
                this.checkGoal();
            }
            setTimeout(() => this.loop(), 1000/60);
        }
    }
    
    protected checkGoal(): void
    {
        if (this.ball.getPosX() + this.ball.getRadius() >= this.setup.general.width)
        {
            this.isLive = this.player0.goal(this.player1, this.surrend.bind(this));
            this.sendGameInfo();
            this.player0.setPos(10, this.setup.general.height / 2);
            this.player1.setPos(this.setup.general.width - 10 - this.player1.getPaddleWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0);
            this.showScore();
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
            this.isLive = this.player1.goal(this.player0, this.surrend.bind(this));
            this.sendGameInfo();
            this.player0.setPos(10, this.setup.general.height / 2);
            this.player1.setPos(this.setup.general.width - 10 - this.player1.getPaddleWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, -this.startSpeed, 0);
            this.showScore();
        }
    }
    
    public showScore(): void
    {
        if (this.setup.general.Overtime && this.setup.general.ScoreWin - 1 == this.player0.getScore() && this.setup.general.ScoreWin - 1 == this.player1.getScore())
        {
            this.setup.general.ScoreWin += this.setup.general.OvertimeScore;
        }
        if (this.player0.getScore() == this.setup.general.ScoreWin)
        {
            this.gameFinish(this.player0, this.player1);
        }
        else if (this.player1.getScore() == this.setup.general.ScoreWin)
        {
            this.gameFinish(this.player1, this.player0);
        }
    }
    
    public launchGame(): void
    {
        this.loop();
    }
    
    public async gameFinish(winner: Player, looser: Player): Promise<void>
    {
        this.isFinish = true;
        this.player0.gameFinish(winner.getId());
        this.player1.gameFinish(winner.getId());
        this.player0.clearSurrend();
        this.player1.clearSurrend();
        await this.handlerGameFinish(this.setup.general.id as string, winner, looser).catch((err) => {console.log(err)});
    }

    public async surrend(surrender: Player): Promise<void>
    {
        this.isFinish = true;
        const winner = surrender.getId() == this.player0.getId() ? this.player1 : this.player0;
        this.player0.gameFinish(winner.getId());
        this.player1.gameFinish(winner.getId());
        await this.handlerGameFinish(this.setup.general.id as string, winner, surrender).catch((err) => {console.log(err)});
    }

    public playerConnect(id: number, socket: Socket): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.playerConnect(socket, this.isLive, this.getSetup());
            this.sendGameInfo();
            return true;
        }
        return false;
    }
    
    public playerDisconnect(id: number): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.playerDisconnect();
            this.isLive = player.unready(this.player0.getId() == player.getId() ? this.player1 : this.player0, this.surrend.bind(this));
            return true;
        }
        return false;
    }
    
    public playerReady(id: number): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            this.isLive = player.ready(this.isLive, player == this.player0 ? this.player1 : this.player0);
            if (this.isLive)
            {
                this.sendGameInfo();
                this.sendGameInfoToSpectators();
            }
            return true;
        }
        return false;
    }

    public playerUnready(id: number): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.unready(player.getId() == this.player0.getId() ? this.player1 : this.player0, this.surrend);
            return true;
        }
        return false;
    }
    
    public getPlayer(id: number): Player | undefined
    {
        if (this.player0.getId() == id)
        {
            return this.player0;
        }
        else if (this.player1.getId() == id)
        {
            return this.player1;
        }
        return undefined;
    }

    public getSocketId(): Array<string>
    {
        const socketId: Array<string> = [];
        const player0Id = this.player0.getSocketId();
        const player1Id = this.player1.getSocketId();
        if (player0Id)
        {
            socketId.push(player0Id);
        }
        if (player1Id)
        {
            socketId.push(player1Id);
        }
        for (const spectator of this.spectators)
        {
            socketId.push(spectator.getSocketId());
        }
        return socketId;

    }

    public isPlayer(client: Socket): boolean
    {
        return this.player0.getSocketId() == client.id || this.player1.getSocketId() == client.id;
    }
    
    public handleEvent(id: number, key: string): void
    {
        const player = this.getPlayer(id);
        const opponent = player == this.player0 ? this.player1 : this.player0;
        if (player != null && this.isLive)
        {
            const keyType = key.slice(0, 1);
            const direction: Direction = key.slice(1, key.length) as Direction;
            if (keyType == "+")
            {
                player.press(direction, opponent);
            }
            else if (keyType == "-")
            {
                player.unpress(direction, opponent);
            }
        }
    }
    
    public getGameInfo(): GameInfo
    {
        return {
            player0: {
                score: this.player0.getScore(),
                paddle: {
                    x: this.player0.getPosX(),
                    y: this.player0.getPosY(),
                    dx: this.player0.getDx(),
                    dy: this.player0.getDy(),
                    width: this.player0.getPaddleWidth(),
                    height: this.player0.getPaddleLength()
                }
            },
            player1: {
                score: this.player1.getScore(),
                paddle: {
                    x: this.player1.getPosX(),
                    y: this.player1.getPosY(),
                    dx: this.player1.getDx(),
                    dy: this.player1.getDy(),
                    width: this.player1.getPaddleWidth(),
                    height: this.player1.getPaddleLength()
                }
            },
            ball: {
                x: this.ball.getPosX(),
                y: this.ball.getPosY(),
                dx: this.ball.getVeloX(),
                dy: this.ball.getVeloY(),
                radius: this.ball.getRadius()
            }
        };
    }

    public getSetup(): Setup
    {
        return this.setup;
    }
    
    public sendGameInfo(): void
    {
        this.player0.emitGameInfo(this.getGameInfo());
        this.player1.emitGameInfo(this.getGameInfo());
    }
    
    public spectatorConnect(id: number, socket: Socket): void
    {
        const spectator = new Spectator(id, socket, this);
        this.spectators.push(spectator);
    }

    public spectatorDisconnect(id: number): void
    {
        const spectator = this.spectators.find(s => s.getId() == id);
        if (spectator != null)
        {
            this.spectators.splice(this.spectators.indexOf(spectator), 1);
        }
    }

    public sendGameInfoToSpectators(): void
    {
        this.spectators.forEach(s => s.sendGameUpdate(this.getGameInfo()));
    }

    public getScore(): Array<number>
    {
        return [this.player0.getScore(), this.player1.getScore()];
    }

    public getPlayersId(): Array<number>
    {
        return [this.player0.getId(), this.player1.getId()];
    }

    public interpolatePosition(userId: number, data: {ball: {x: number, y: number}, player: {x: number, y: number}}): void
    {
        const opp = userId == this.player0.getId() ? this.player1 : this.player0;
        const player = this.getPlayer(userId);
        if (opp != null)
        {
            const ball: {x: number, y: number} = {x: this.ball.getPosX(), y: this.ball.getPosY()};
            const paddle: {x: number, y: number} = {x: opp.getPosX(), y: opp.getPosY()};

            const ballDistance = Math.sqrt(Math.pow(ball.x - data.ball.x, 2) + Math.pow(ball.y - data.ball.y, 2));
            const playerDistance = Math.sqrt(Math.pow(paddle.x - data.player.x, 2) + Math.pow(paddle.y - data.player.y, 2));
            if (ballDistance > 50 || playerDistance > 15)
            {
                player.emitGameInfo(this.getGameInfo());
            }
        }
    }

}