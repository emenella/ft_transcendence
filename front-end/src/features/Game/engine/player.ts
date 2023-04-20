import { Paddle } from "./Paddle";
import { Bind } from "./interfaces/ft_pong.interface";

export class Player {
    public id: number;
    private username: string;
    public score: number;
    public paddle: Paddle;
    protected bind: Bind | null;
    
    constructor(id: number, bind: Bind | null, paddle: Paddle, username: string) {
        this.id = id;
        this.username = username;
        this.score = 0;
        this.paddle = paddle;
        this.bind = bind;
    }
    
    public setKeyBindings(): void {
        document.addEventListener("keydown", (event) => { this.handleKeyDown(event) }, false);
        document.addEventListener("keyup", (event) => { this.handleKeyUp(event) }, false);
    }
    
    public unbindKeys(): void {
        document.removeEventListener("keydown", () => this.handleKeyDown, false);
        document.removeEventListener("keyup", () => this.handleKeyUp, false);
    }
    
    public handleKeyDown(event: KeyboardEvent): void
    {
        if (this.bind) {
            switch (event.key) {
                case this.bind.up:
                    this.paddle.keyDownUp();
                    break;
                case this.bind.down:
                    this.paddle.keyDownDown();
                    break;
                case this.bind.left:
                    this.paddle.keyDownLeft();
                    break;
                case this.bind.right:
                    this.paddle.keyDownRight();
                    break;
                default:
                    break;
            }
        }
    }
    
    public handleKeyUp(event: KeyboardEvent): void
    {
        if (this.bind){
            switch (event.key) {
                case this.bind.up:
                    this.paddle.keyUpY();
                    break;
                case this.bind.down:
                    this.paddle.keyUpY();
                    break;
                case this.bind.left:
                    this.paddle.keyUpX();
                    break;
                case this.bind.right:
                    this.paddle.keyUpX();
                    break;
                default:
                    break;
            }
        }
    }
    
    public getScore(): number {
        return this.score;
    }
    
    public getName(): string {
        return this.username;
    }
}