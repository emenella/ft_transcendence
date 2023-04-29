import { Player } from "./player";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Socket } from "socket.io-client";
import { PlayerClient } from "./playerClient";
import { PlayerRemote } from "./playerRemote";
import { SockEvent, User } from "../../../utils/backendInterface";
import { Setup, GameInfo, Bind, GameSettings } from "./interfaces/ft_pong.interface";

export class ft_pong {

    private ctx: CanvasRenderingContext2D;
    // @ts-ignore: Unreachable code error
    private player0: PlayerClient;
    // @ts-ignore: Unreachable code error
    private player1: PlayerClient;
    // @ts-ignore: Unreachable code error
    private ball: Ball;
    // @ts-ignore: Unreachable code error
    private isLive: boolean;
    // @ts-ignore: Unreachable code error
    private isFinish: boolean;
    // @ts-ignore: Unreachable code error
    private isSpec: boolean;
    // @ts-ignore: Unreachable code error
    private startSpeed: number;
    // @ts-ignore: Unreachable code error
    private setup: Setup;
    

    private user: User | null;
    private bind: Bind;

    // @ts-ignore: Unreachable code error
    private ratioX: number;
    // @ts-ignore: Unreachable code error
    private ratioY: number;

    private width: number;
    private height: number;

    private socket: Socket;

    constructor(_socket: Socket, gameSetting: GameSettings, ctx: CanvasRenderingContext2D, setup: Setup, isSpec: boolean)
    {
        this.ctx = ctx;
        // assign attributes
        this.socket = _socket;
        this.user = gameSetting.user;
        this.bind = gameSetting.bind;
        this.width = gameSetting.width;
        this.height = gameSetting.height;
        this.isSpec = isSpec;
        this.setupGame(setup);
    }

    public setupGame (setup: Setup) {
        this.setup = setup;
        if (!this.user)
            throw new Error("User is null");
        this.ratioX = this.width / this.setup.general.width;
        this.ratioY = this.height / this.setup.general.height;
        if (this.isSpec)
        {
            this.player0 = new PlayerRemote(this.setup.player0.id, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.setup.player0.username);
            this.player1 = new PlayerRemote(this.setup.player1.id, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.setup.player1.username);
        }
        else if (this.user.id === this.setup.player0.id)
        {
            this.player0 = new PlayerClient(this.setup.player0.id, this.bind, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.setup.player0.username);
            this.player0.setKeyBindings();
            this.player1 = new PlayerRemote(this.setup.player1.id, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.setup.player1.username);
        }
        else if (this.user.id === this.setup.player1.id)
        {
            this.player0 = new PlayerRemote(this.setup.player0.id, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.setup.player0.username);
            this.player1 = new PlayerClient(this.setup.player1.id, this.bind, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.setup.player1.username);
            this.player1.setKeyBindings();
        }
        this.startSpeed = this.setup.ball.speed * this.ratioX;
        this.ball = new Ball(this.setup.ball.radius * this.ratioY, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.startSpeed, 0, this.setup.ball.color, this.setup.ball.maxSpeed * this.ratioX);
        this.isLive = false;
        this.isFinish = false;
        this.socket.on(SockEvent.SE_GM_INFO, this.handleGameUpdate);
        this.socket.on(SockEvent.SE_GM_FINISH, this.handleGameFinish);
        this.socket.on(SockEvent.SE_GM_LIVE, this.handleLive);
        this.socket.on(SockEvent.SE_GM_UNREADY, this.handlerUnready);
        this.socket.emit(SockEvent.SE_GM_INFO);
        this.draw();
        this.startGame();
    }

    public draw(): void
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.ctx.canvas.width / 2, 0, 1, this.ctx.canvas.height)
        this.ball.draw(this.ctx);
        this.showScore();
        this.player0.paddle.draw(this.ctx);
        this.player1.paddle.draw(this.ctx);
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        if(!this.isLive && this.player0.isReady === this.player1.isReady && !this.isSpec)
        {
            this.ctx.fillText("Press space to start", this.width / 2 - 150, this.height / 2 - 150);
        }
        else if (!this.isLive && !this.isSpec)
        {
            this.ctx.fillText("Waiting for opponent", this.width / 2 - 150, this.height / 2 - 150);
        }
    }

    private loop(): void
    {
        if (!this.isFinish)
        {
            if (this.isLive)	
            {
                this.ball.move(this.ctx, this.player0, this.player1);
                this.player0.paddle.move(this.ctx);
                this.player1.paddle.move(this.ctx);
            }
            this.draw();
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    public showScore(): void
    {
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(this.player0.getName() + " : " + this.player0.getScore(), 10, 30);
        this.ctx.fillText(this.player1.getName() + " : " + this.player1.getScore(), this.width - 300, 30);
    }

    public screenFinish(winner: number): void
    {
        const player = winner === this.player0.id ? this.player0 : this.player1;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText("Game over", this.width / 2 - 150, this.height / 2 - 150);
        this.ctx.fillText(player.getName() + " win", this.width / 2 - 150, this.height / 2 - 100);
        this.ctx.fillText("Score : " + player.getScore() + (this.player0.id != player.id ? this.player0.getScore() : this.player1.getScore()), this.width / 2 - 150, this.height / 2 - 50);
        this.showScore();
        this.stop();
    }

    public startGame(): void
    {
        this.loop();
    }

    private handleGameUpdate = (data: GameInfo): void => {
        this.player0.paddle.setPos(data.player0.paddle.x * this.ratioX, data.player0.paddle.y * this.ratioY);
        this.player1.paddle.setPos(data.player1.paddle.x * this.ratioX, data.player1.paddle.y * this.ratioY);
        this.ball.setPos(data.ball.x * this.ratioX, data.ball.y * this.ratioY, data.ball.dx * this.ratioX, data.ball.dy * this.ratioY);
        this.player0.score = data.player0.score;
        this.player1.score = data.player1.score;
        this.draw();
    }

    private handleLive = (): void => {
        this.isLive = true;
    }

    private handlerUnready = (id: number): void => {
        this.isLive = false;
        const player = this.player0.id === id ? this.player0 : this.player1;
        player.isReady = false;
        this.draw();
    }

    private handleGameFinish = (): void => {
        this.isFinish = true;
    }

    public stop = (): void =>
    {
        this.socket.off(SockEvent.SE_GM_INFO, this.handleGameUpdate);
        this.socket.off(SockEvent.SE_GM_FINISH, this.handleGameFinish);
        this.socket.off(SockEvent.SE_GM_LIVE, this.handleLive);
        this.socket.off(SockEvent.SE_GM_UNREADY, this.handlerUnready);
        this.isFinish = true;
    }

}