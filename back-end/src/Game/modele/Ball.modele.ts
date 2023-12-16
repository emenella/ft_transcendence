import { Player } from "./Player.modele";
import { general, Setup } from "../interface/Game.interface";

export class Ball
{
    private posX: number;
    private posY: number;
    private radius: number;
    private veloX: number;
    private veloY: number;
    private color: string;
    private general: general;
    private maxSpeed: number;
    
    constructor(_setup: Setup)
    {
        this.general = _setup.general;
        this.posX = this.general.width / 2;
        this.posY = this.general.height / 2;
        this.radius = _setup.ball.radius;
        this.veloX = _setup.ball.speed;
        this.veloY = 0;
        this.color = _setup.ball.color;
        this.maxSpeed = _setup.ball.maxSpeed;
    }

    
    
    private collisionPlayer(player: Player): boolean {
        const paddleWidth = player.getPaddleWidth();
        const paddleLength = player.getPaddleLength();
        const distanceX = Math.abs(this.posX - player.getPosX());
        const distanceY = Math.abs(this.posY - player.getPosY());
        const radiusSum = this.radius + paddleWidth;

        if (distanceX <= radiusSum && distanceY <= paddleLength) {
            if (distanceX <= paddleWidth / 2) {
                this.veloX = -this.veloX;
                this.veloY = -((player.getPosY() - this.posY) / player.getPaddleLength() * 10);
            } else {
                // Collision sur le dessus ou le dessous de la raquette
                this.veloY = -((player.getPosY() - this.posY) / player.getPaddleLength() * 10);
                this.veloX = -this.veloX;
            }
            return true;
        }
        return false;
    }

    
    
    private collisionWall(): boolean
    {
        if (this.posY - this.radius <= 0 || this.posY + this.radius >= this.general.height) {
            this.veloY = -this.veloY;
    
            if (this.posY - this.radius <= 0) {
                this.posY = this.radius;
            } else {
                this.posY = this.general.height - this.radius;
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

    public move(player0: Player, player1: Player, update: () => void)
    {
        if (this.collisionWall() || this.collisionPlayer(player0) || this.collisionPlayer(player1))
        {
            update();
        }
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

    public getVeloX(): number
    {
        return this.veloX;
    }

    public getVeloY(): number
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