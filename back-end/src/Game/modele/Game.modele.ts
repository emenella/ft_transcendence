import { Player, Direction } from "./Player.modele";
import { Ball } from "./Ball.modele";
import { Paddle } from "./Paddle.modele";
import { Socket } from "socket.io";
import { Spectator } from "./Spec.modele";
import { GameService } from "../Game.service";

export interface general {
    id: string;
    ScoreWin: number;
    Overtime: boolean;
    OvertimeScore: number;
    height: number;
    width: number;
}

export interface player {
    id: number;
    color: string;
    length: number;
    width: number;
    speedX: number;
    speedY: number;
}

export interface ball {
    color: string;
    radius: number;
    speed: number;
}

export interface Setup {
    general: general;
    player0: player;
    player1: player;
    ball: ball;
}

export class GameInfo
{
    player0: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            width: number;
            height: number;
        };
    }
    player1: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            width: number;
            height: number;
        }
    }
    ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
        radius: number;
    }
}

export class Game {
    
    public player0: Player;
    public player1: Player;
    private spectators: Spectator[] = [];
    private isLive: boolean;
    private isFinish: boolean;
    private ball: Ball;
    private startSpeed: number;
    public setup: Setup;
    
    constructor(_setup: Setup, readonly handlerGameFinish: (id: string) => void)
    {
        this.setup = _setup;
        this.startSpeed = this.setup.ball.speed;
        this.player0 = new Player(this.setup.player0.id, new Paddle(this.setup.player0.color, this.setup.player0.width, this.setup.player0.length, 10, this.setup.general.height / 2, this.setup.player0.speedX, this.setup.player0.speedY, this.setup.general));
        this.ball = new Ball(this.setup.ball.radius, this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0, this.setup.ball.color, this.setup.general);	
        this.player1 = new Player(this.setup.player1.id, new Paddle(this.setup.player1.color, this.setup.player1.width, this.setup.player1.length, this.setup.general.width - 10 - this.setup.player1.width, this.setup.general.height / 2, this.setup.player1.speedX, this.setup.player1.speedY, this.setup.general));
        this.isLive = false;
        this.isFinish = false;
    }
    
    private loop(): void
    {
        if (!this.isFinish)
        {
            if (this.isLive)	
            {
                this.ball.move(this.player0, this.player1);
                this.player0.paddle.move();
                this.player1.paddle.move();
                this.checkGoal();
                this.sendGameInfo();
                this.sendGameInfoToSpectators();
            }
            setTimeout(() => this.loop(), 1000/128);
        }
    }
    
    protected checkGoal(): void
    {
        if (this.ball.getPosX() + this.ball.getRadius() >= this.setup.general.width)
        {
            this.player0.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0);
            this.playerUnready(this.player1.id);
            this.showScore();
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
            this.player1.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, -this.startSpeed, 0);
            this.playerUnready(this.player0.id);
            this.showScore();
        }
    }
    
    public showScore(): void
    {
        if (this.setup.general.Overtime && this.setup.general.ScoreWin - 1 == this.player0.score && this.setup.general.ScoreWin - 1 == this.player1.score)
        {
            this.setup.general.ScoreWin += this.setup.general.OvertimeScore;
            console.log("Overtime");
        }
        if (this.player0.score == this.setup.general.ScoreWin)
        {
            this.gameFinish();
            console.log(this.player0.id + " win");
        }
        else if (this.player1.score == this.setup.general.ScoreWin)
        {
            this.gameFinish();
            console.log(this.player1.id + " win");
        }
        console.log(this.player0.score + "-" + this.player1.score);
    }
    
    public launchGame(): void
    {
        this.loop();
    }
    
    public gameFinish(): void
    {
        this.isFinish = true;
        this.player0.socket.emit("game:finish", this.player0.id);
        this.player1.socket.emit("game:finish", this.player1.id);
        this.handlerGameFinish(this.setup.general.id);
    }
    public playerConnect(id: number, socket: Socket): boolean
    {
        console.log("Player " + id + " connected to game" + this.setup.general.id + ".");
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.isConnected = true;
            player.socket = socket;
            player.socket.emit("game:join");
            if (this.player0.isConnected && this.player1.isConnected)
                this.launchGame();
            return true;
        }
        return false;
    }
    
    public playerDisconnect(id: number): boolean
    {
        console.log("Player " + id + " disconnected from game" + this.setup.general.id + ".");
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.isConnected = false;
            if (this.isLive)
                this.playerUnready(player.id);
            return true;
        }
        return false;
    }
    
    public playerReady(id: number): boolean
    {
        console.log("Player " + id + " is ready.");
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.isReady = true;
            if (this.player0.isReady && this.player1.isReady)
            {
                this.isLive = true;
                this.player0.socket.emit("game:live", this.setup.general.id);
                this.player1.socket.emit("game:live", this.setup.general.id);
                this.sendGameInfo();
            }
            return true;
        }
        return false;
    }

    public playerUnready(id: number): boolean
    {
        console.log("Player " + id + " is unready.");
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.isReady = false;
            this.isLive = false;
            this.sendGameInfo();
            return true;
        }
        return false;
    }
    
    public getPlayer(id: number): Player
    {
        if (id == this.player0.id)
        return this.player0;
        else if (id == this.player1.id)
        return this.player1;
        else
        return null;
    }
    
    public handleEvent(id: number, key: string): void
    {
        console.log("Player " + id + " pressed " + key + ".");
        const player = this.getPlayer(id);
        if (player != null)
        {
            switch (key)
            {
                case "+UP":
                    player.paddle.keyDownUp();
                    break;
                case "-UP":
                    player.paddle.keyUpY();
                    break;
                case "+DOWN":
                    player.paddle.keyDownDown();
                    break;
                case "-DOWN":
                    player.paddle.keyUpY();
                    break;
                case "+LEFT":
                    player.paddle.keyDownLeft();
                    break;
                case "-LEFT":
                    player.paddle.keyUpX();
                    break;
                case "+RIGHT":
                    player.paddle.keyDownRight();
                    break;
                case "-RIGHT":
                    player.paddle.keyUpX();
                    break;
                default:
                    break;
            }
        }
    }
    
    public getGameInfo(): GameInfo
    {
        return {
            player0: {
                score: this.player0.score,
                paddle: {
                    x: this.player0.paddle.getPosX(),
                    y: this.player0.paddle.getPosY(),
                    dx: this.player0.paddle.getDx(),
                    dy: this.player0.paddle.getDy(),
                    width: this.player0.paddle.getWidth(),
                    height: this.player0.paddle.getLength()
                }
            },
            player1: {
                score: this.player1.score,
                paddle: {
                    x: this.player1.paddle.getPosX(),
                    y: this.player1.paddle.getPosY(),
                    dx: this.player1.paddle.getDx(),
                    dy: this.player1.paddle.getDy(),
                    width: this.player1.paddle.getWidth(),
                    height: this.player1.paddle.getLength()
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
        this.player0.socket.emit("game:info", this.getGameInfo());
        this.player1.socket.emit("game:info", this.getGameInfo());
    }
    
    public spectatorConnect(id: number, socket: Socket): void
    {
        const spectator = new Spectator(id, socket, this);
        this.spectators.push(spectator);
    }

    public spectatorDisconnect(id: number): void
    {
        const spectator = this.spectators.find(s => s.id == id);
        if (spectator != null)
        {
            this.spectators.splice(this.spectators.indexOf(spectator), 1);
        }
    }

    public sendGameInfoToSpectators(): void
    {
        this.spectators.forEach(s => s.sendGameUpdate());
    }
    
}