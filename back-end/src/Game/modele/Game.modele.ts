import { Player, Direction } from "./Player.modele";
import { Ball } from "./Ball.modele";
import { Paddle } from "./Paddle.modele";

export interface general {
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

export class Game {
    
    public player0: Player;
    public player1: Player;
    public isLive: boolean;
    public isFinish: boolean;
    private idPlayerPause: number;
    private ball: Ball;
    private startSpeed: number;
    private setup: Setup;
    
    constructor(_setup: Setup)
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
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, this.setup.ball.speed, 0);
            this.pauseGame(this.player0.id);
            console.log(this.showScore());
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
            this.player1.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, -this.setup.ball.speed, 0);
            this.pauseGame(this.player1.id);
            console.log(this.showScore());
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
            this.isFinish = true;
            console.log(this.player0.id + " win");
        }
        else if (this.player1.score == this.setup.general.ScoreWin)
        {
            this.isFinish = true;
            console.log(this.player1.id + " win");
        }
        console.log(this.player0.score + "-" + this.player1.score);
    }
    
    public launchGame(): void
    {
        this.loop();
    }

    public playerConnect(id: number): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.isConnected = true;
            if (this.player0.isConnected && this.player1.isConnected)
                this.launchGame();
            return true;
        }
        return false;
    }

    public playerDisconnect(id: number): boolean
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            player.isConnected = false;
            if (this.isLive)
                this.pauseGame(player.id);
            return true;
        }
        return false;
    }

    public pauseGame(id: number): void
    {
        this.isLive = false;
        this.idPlayerPause = id;
    }

    public resumeGame(id: number): void
    {
        if (id == this.idPlayerPause)
        {
            this.isLive = true;
            this.idPlayerPause = null;
        }
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
        if (player != null)
        {
            if (key == "+UP")
                player.press(Direction.UP);
            else if (key == "+DOWN")
                player.press(Direction.DOWN);
            else if (key == "-UP")
                player.unpress(Direction.UP);
            else if (key == "-DOWN")
                player.unpress(Direction.DOWN);
            else if (key == "SPACE")
                this.resumeGame(id);
        }
    }

    public sendGameInfo(): void
    {
        const gameInfo = {
            player0: {
                score: this.player0.score,
                paddle: {
                    x: this.player0.paddle.getPosX(),
                    y: this.player0.paddle.getPosY(),
                    width: this.player0.paddle.getWidth(),
                    height: this.player0.paddle.getLength()
                }
            },
            player1: {
                score: this.player1.score,
                paddle: {
                    x: this.player1.paddle.getPosX(),
                    y: this.player1.paddle.getPosY(),
                    width: this.player1.paddle.getWidth(),
                    height: this.player1.paddle.getLength()
                }
            },
            ball: {
                x: this.ball.getPosX(),
                y: this.ball.getPosY(),
                radius: this.ball.getRadius()
            }
        };
        this.player0.socket.emit("gameInfo", gameInfo);
        this.player1.socket.emit("gameInfo", gameInfo);
    }

    public getGameInfo(id: number): any
    {
        const player = this.getPlayer(id);
        if (player != null)
        {
            const gameInfo = {
                player0: {
                    score: this.player0.score,
                    paddle: {
                        x: this.player0.paddle.getPosX(),
                        y: this.player0.paddle.getPosY(),
                        width: this.player0.paddle.getWidth(),
                        height: this.player0.paddle.getLength()
                    }
                },
                player1: {
                    score: this.player1.score,
                    paddle: {
                        x: this.player1.paddle.getPosX(),
                        y: this.player1.paddle.getPosY(),
                        width: this.player1.paddle.getWidth(),
                        height: this.player1.paddle.getLength()
                    }
                },
                ball: {
                    x: this.ball.getPosX(),
                    y: this.ball.getPosY(),
                    radius: this.ball.getRadius()
                }
            };
            return gameInfo;
        }
        return null;
    }
}