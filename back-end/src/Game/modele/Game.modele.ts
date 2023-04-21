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
    
    constructor(_setup: Setup, readonly handlerGameFinish: (id: string) => Promise<void>)
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
                this.ball.move(this.player0, this.player1);
                this.player0.move();
                this.player1.move();
                this.checkGoal();
                this.sendGameInfo();
                this.sendGameInfoToSpectators();
            }
            setTimeout(() => this.loop(), 1000/60);
        }
    }
    
    protected checkGoal(): void
    {
        if (this.ball.getPosX() + this.ball.getRadius() >= this.setup.general.width)
        {
            this.isLive = this.player0.goal(this.isLive, this.player1);
            this.player0.setPos(10, this.setup.general.height / 2);
            this.player1.setPos(this.setup.general.width - 10 - this.player1.getPaddleWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0);
            this.showScore();
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
            this.isLive = this.player1.goal(this.isLive, this.player0);
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
            this.gameFinish();
        }
        else if (this.player1.getScore() == this.setup.general.ScoreWin)
        {
            this.gameFinish();
        }
    }
    
    public launchGame(): void
    {
        this.loop();
    }
    
    public async gameFinish(): Promise<void>
    {
        this.isFinish = true;
        const winner = this.player0.getScore() == this.setup.general.ScoreWin ? this.player0.getId() : this.player1.getId();
        this.player0.gameFinish(winner);
        this.player1.gameFinish(winner);
        await this.handlerGameFinish(this.setup.general.id as string);
    }

    public playerConnect(id: number, socket: Socket): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.playerConnect(socket, this.isLive, this.getSetup());
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
            this.sendGameInfo();
            return true;
        }
        return false;
    }

    public playerUnready(id: number): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.unready(player.getId() == this.player0.getId() ? this.player1 : this.player0);
            this.isLive = false;
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
        console.log(this.player0, this.player1);
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
        console.log(this.player0.getSocketId(), this.player1.getSocketId(), " isPlayer")
        return this.player0.getSocketId() == client.id || this.player1.getSocketId() == client.id;
    }
    
    public handleEvent(id: number, key: string): void
    {
        const player = this.getPlayer(id);
        if (player != null && this.isLive)
        {
            const keyType = key.slice(0, 1);
            const direction: Direction = key.slice(1, key.length) as Direction;
            if (keyType == "+")
            {
                player.press(direction);
            }
            else if (keyType == "-")
            {
                player.unpress(direction);
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

}