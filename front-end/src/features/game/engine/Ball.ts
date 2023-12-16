import { Player } from "./player";

export class Ball
{
    private posX: number;
    private posY: number;
    private radius: number;
    private veloX: number;
    private veloY: number;
    private color: string;
    private maxSpeed: number;
    
    constructor(_radius: number, _startX: number, _startY: number, _speedX: number, _speedY: number, _color: string, _maxSpeed: number)
    {
        this.posX = _startX;
        this.posY = _startY;
        this.radius = _radius;
        this.veloX = _speedX;
        this.veloY = _speedY;
        this.color = _color;
        this.maxSpeed = _maxSpeed;
    }

    
    public draw(ctx :CanvasRenderingContext2D): void
    {
        // Draw ball
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
    
    private collisionPlayer(player: Player): boolean {
        const paddleWidth = player.paddle.getWidth();
        const paddleLength = player.paddle.getLength();
        const distanceX = Math.abs(this.posX - player.paddle.getPosX());
        const distanceY = Math.abs(this.posY - player.paddle.getPosY());
        const radiusSum = this.radius + paddleWidth;

        if (distanceX <= radiusSum && distanceY <= paddleLength) {
            if (distanceX <= paddleWidth / 2) {
                this.veloX = -this.veloX;
                this.veloY = -((player.paddle.getPosY() - this.posY) / player.paddle.getLength() * 10);
            } else {
                this.veloX = -this.veloX;
                this.veloY = -((player.paddle.getPosY() - this.posY) / player.paddle.getLength() * 10);
            }
            return true;
        }
        return false;
    }
    
    private collisionWall(ctx : CanvasRenderingContext2D): boolean
    {
        if (this.posY - this.radius <= 0 || this.posY + this.radius >= ctx.canvas.height) {
            this.veloY = -this.veloY;
    
            if (this.posY - this.radius <= 0) {
                this.posY = this.radius;
            } else {
                this.posY = ctx.canvas.height - this.radius;
            }
    
            return true;
        }
        return false;
    }

    public setPos(x: number, y: number, dx: number, dy: number)
    {
        this.posX = x;
        this.posY = y;
        this.veloX = dx;
        this.veloY = dy;
    }
    

    public move(ctx: CanvasRenderingContext2D, player0: Player, player1: Player): void
    {
        this.collisionWall(ctx) || this.collisionPlayer(player0) || this.collisionPlayer(player1);
        this.posX += this.veloX;
        this.posY += this.veloY;
    }

    public getPosX(): number
    {
        return this.posX;
    }

    public getPosY(): number
    {
        return this.posY;
    }

    public getDx(): number
    {
        return this.veloX;
    }

    public getDy(): number
    {
        return this.veloY;
    }

    public getRadius(): number
    {
        return this.radius;
    }

    public getColor(): string
    {
        return this.color;
    }
}