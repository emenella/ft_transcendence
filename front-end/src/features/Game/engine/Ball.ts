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
        console.log("Ball created: " + this.posX + " " + this.posY + " " + this.radius + " " + this.veloX + " " + this.veloY);
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
    
    private collisionPlayer(player: Player): boolean
    {
        if (this.posX + this.radius > player.paddle.getPosX() - player.paddle.getWidth() && this.posX - this.radius < player.paddle.getPosX() + player.paddle.getWidth())
        {
            if (this.posY + this.radius > player.paddle.getPosY() - player.paddle.getLength() && this.posY - this.radius < player.paddle.getPosY() + player.paddle.getLength())
            {
                this.veloY = (player.paddle.getPosY() - this.posY) / player.paddle.getLength() * 10;
                this.veloX = -this.veloX;
                this.accelerate();
                return true;
            }
        }
        return false;
    }
    
    private collisionWall(ctx :CanvasRenderingContext2D): boolean
    {
        if (this.posY + this.radius >= ctx.canvas.height || this.posY - this.radius <= 0)
        {
            this.veloY = -this.veloY;
            this.accelerate();
            return true;
        }
        return false;
    }

    public accelerate()
    {
        if (this.veloX < this.maxSpeed && this.veloX > -this.maxSpeed)
            this.veloX *= 1.1;
        if (this.veloY < this.maxSpeed && this.veloY > -this.maxSpeed)
            this.veloY *= 1.1;
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
        if (this.collisionWall(ctx) || this.collisionPlayer(player0) || this.collisionPlayer(player1))
        {}
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

    public getRadius(): number
    {
        return this.radius;
    }

    public getColor(): string
    {
        return this.color;
    }
}