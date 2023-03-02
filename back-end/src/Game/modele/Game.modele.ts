import { Player, Direction } from "./Player.modele";
import { Ball } from "./Ball.modele";
import { Paddle } from "./Paddle.modele";
import { Socket } from "socket.io";
import { Spectator } from "./Spec.modele";
import { GameService } from "../Game.service";
import { GameInfo, Setup } from "../interface/Game.interface";

export class Game {
    
    public player0: Player;
    public player1: Player;
    private spectators: Spectator[] = [];
    private isLive: boolean;
    private isFinish: boolean;
    private ball: Ball;
    private startSpeed: number;
    public setup: Setup;
    
    constructor(_setup: Setup, readonly handlerGameFinish: (id: string) => Promise<void>)
    {
        this.setup = _setup;
        this.startSpeed = this.setup.ball.speed;
        this.player0 = new Player(this.setup.player0.id, new Paddle(this.setup.player0.color, this.setup.player0.width, this.setup.player0.length, 10, this.setup.general.height / 2, this.setup.player0.speedX, this.setup.player0.speedY, this.setup.general));
        this.ball = new Ball(this.setup.ball.radius, this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0, this.setup.ball.color, this.setup.general);	
        this.player1 = new Player(this.setup.player1.id, new Paddle(this.setup.player1.color, this.setup.player1.width, this.setup.player1.length, this.setup.general.width - 10 - this.setup.player1.width, this.setup.general.height / 2, this.setup.player1.speedX, this.setup.player1.speedY, this.setup.general));
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
            this.playerUnready(this.player1.id);
            this.resetPlayers();
            this.player0.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0);
            this.showScore();
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
            this.playerUnready(this.player0.id);
            this.resetPlayers();
            this.player1.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, -this.startSpeed, 0);
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
        const winner = this.player0.score == this.setup.general.ScoreWin ? this.player0.id : this.player1.id;
        this.player0.socket.emit("game:finish", winner);
        this.player1.socket.emit("game:finish", winner);
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
            if (this.isLive)
                player.socket.emit("game:live");
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
            if (this.player0.isReady && this.player1.isReady && !this.isLive)
            {
                console.log("Game " + this.setup.general.id + " is live.");
                this.isLive = true;
                this.player0.socket.emit("game:live");
                this.player1.socket.emit("game:live");
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
            this.player0.socket.emit("game:unready", player.id);
            this.player1.socket.emit("game:unready", player.id);
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
    
    private resetPlayers(): void
    {
        this.player0.reset();
        this.player1.reset();
    }
}