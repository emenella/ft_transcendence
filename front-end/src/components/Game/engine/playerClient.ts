import { Player } from "./player";
import { Paddle } from "./Paddle";
import { Socket } from "socket.io-client";
import { Bind } from "./interfaces/ft_pong.interface";

export interface gameInfo {
    player0: {
        score: number;
        paddle: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    },
    player1: {
        score: number;
        paddle: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    },
    ball: {
        x: number;
        y: number;
        radius: number;
    }
}

export class PlayerClient extends Player
{
    private socket: Socket;
    public  isReady: boolean = false;

    constructor(_id: number, _bind: Bind | null, _paddle: Paddle, _socket: Socket, username: string)
    {
        super(_id, _bind, _paddle, username);
        this.socket = _socket;
    }

    public handleKeyDown(event: KeyboardEvent): void
    {
        console.log(event.key);
        if (this.bind) {    
            switch (event.key) {
                case this.bind.up:
                    this.paddle.keyDownUp();
                    this.socket.emit("game:event", "+UP");
                    break;
                case this.bind.down:
                    this.paddle.keyDownDown();
                    this.socket.emit("game:event", "+DOWN");
                    break;
                case this.bind.left:
                    this.paddle.keyDownLeft();
                    this.socket.emit("game:event", "+LEFT");
                    break;
                case this.bind.right:
                    this.paddle.keyDownRight();
                    this.socket.emit("game:event", "+RIGHT");
                    break;
                case this.bind.ready:
                    this.ready();
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
                    this.socket.emit("game:event", "-UP");
                    break;
                case this.bind.down:
                    this.paddle.keyUpY();
                    this.socket.emit("game:event", "-DOWN");
                    break;
                case this.bind.left:
                    this.paddle.keyUpX();
                    this.socket.emit("game:event", "-LEFT");
                    break;
                case this.bind.right:
                    this.paddle.keyUpX();
                    this.socket.emit("game:event", "-RIGHT");
                    break;
                default:	
                    break;
            }
        }
    }

    public setPos(x: number, y: number): void
    {
        this.paddle.setPos(x, y);
    }

    public ready(): void
    {
        console.log("ready")
        this.isReady = true;
        this.socket.emit("game:ready");
    }
}