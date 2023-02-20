import { Player } from "./Player.modele";
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
    name: string;
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
    
    private player0: Player;
    private player1: Player;
    private ball: Ball;
    private isLive: boolean;
    private isFinish: boolean;
    private startSpeed: number;
    private setup: Setup;
    
    constructor(_setup: Setup)
    {
        this.setup = _setup;
        this.startSpeed = this.setup.ball.speed;
        this.player0 = new Player(this.setup.player0.name, new Paddle(this.setup.player0.color, this.setup.player0.width, this.setup.player0.length, 10, this.setup.general.height / 2, this.setup.player0.speedX, this.setup.player0.speedY, this.setup.general));
        this.ball = new Ball(this.setup.ball.radius, this.setup.general.width / 2, this.setup.general.height / 2, this.startSpeed, 0, this.setup.ball.color, this.setup.general);	
        this.player1 = new Player(this.setup.player1.name, new Paddle(this.setup.player1.color, this.setup.player1.width, this.setup.player1.length, this.setup.general.width - 10 - this.setup.player1.width, this.setup.general.height / 2, this.setup.player1.speedX, this.setup.player1.speedY, this.setup.general));
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
            }
        }
        setTimeout(() => this.loop(), 1000/128);
        
    }
    
    protected checkGoal(): void
    {
        if (this.ball.getPosX() + this.ball.getRadius() >= this.setup.general.width)
        {
            this.player0.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, this.setup.ball.speed, 0);
            this.isLive = false;
            console.log(this.showScore());
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
            this.player1.score++;
            this.player0.paddle.setPos(10, this.setup.general.height / 2);
            this.player1.paddle.setPos(this.setup.general.width - 10 - this.player1.paddle.getWidth(), this.setup.general.height / 2);
            this.ball.setPos(this.setup.general.width / 2, this.setup.general.height / 2, -this.setup.ball.speed, 0);
            this.isLive = false;
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
            console.log(this.player0.name + " win");
        }
        else if (this.player1.score == this.setup.general.ScoreWin)
        {
            this.isFinish = true;
            console.log(this.player1.name + " win");
        }
        console.log(this.player0.score + "-" + this.player1.score);
    }
    
    public startGame(): void
    {
        this.loop();
    }
}