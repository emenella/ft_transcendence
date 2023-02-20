import { general } from "./Game.modele";

export class Paddle
{
    //Position of paddle
    private posX: number;
    private posY: number;

    // direction of paddle
    private dy: number;
    private dx: number;

    // size of paddle
    private width: number;
    private length: number;
    private color: string;
    
    // speed of paddle
    private veloX: number;
    private veloY: number;

    private general: general;

    constructor(_color: string ,_width: number, _length: number, _startX: number, _startY: number, _speedX: number, _speedY: number, _general: general)
    {
        this.posX = _startX;
        this.posY = _startY;
        this.width = _width;
        this.length = _length;
        this.veloX = _speedX;
        this.veloY = _speedY;
        this.color = _color;
        this.dx = 0;
        this.dy = 0;
        this.general = _general;
        console.log("Paddle created: " + this.posX + " " + this.posY + " " + this.width + " " + this.length + " " + this.veloX + " " + this.veloY);
    }

    public keyDownUp(): void
    {
        this.dy = -this.veloY;
    }

    public keyDownDown(): void
    {
        this.dy = this.veloY;
    }

    public keyDownLeft(): void
    {
        this.dx = -this.veloX;
    }

    public keyDownRight(): void
    {
        this.dx = this.veloX;
    }

    public keyUpY(): void
    {
        this.dy = 0;
    }

    public keyUpX(): void
    {
        this.dx = 0;
    }

    public move(): void
    {
        this.posX += this.dx;
        this.posY += this.dy;
        //limit
        if (this.posX - this.width / 2 < 0)
        {
            this.posX = this.width / 2;
        }
        if (this.posX + this.width / 2 > this.general.width)
        {
            this.posX = this.general.width - (this.width / 2);
        }
        if (this.posY - this.length / 2 < 0)
        {
            this.posY = this.length / 2;
        }
        if (this.posY + this.length / 2 > this.general.height)
        {
            this.posY = this.general.height - (this.length / 2);
        }
    }

    public setPos(nPosX: number, nPosY: number)
    {
        this.posX = nPosX;
        this.posY = nPosY;
    }

    public getPosX(): number
    {
        return this.posX;
    }

    public getPosY(): number
    {
        return this.posY;
    }

    public getWidth(): number
    {
        return this.width;
    }

    public getLength(): number
    {
        return this.length;
    }
}