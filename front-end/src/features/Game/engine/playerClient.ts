import { Player } from "./player";
import { Paddle } from "./Paddle";
import { Socket } from "socket.io-client";
import { Bind } from "./interfaces/ft_pong.interface";
import { SockEvent } from "../../../utils/backendInterface";

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
    protected socket: Socket;
    public  isReady: boolean = false;
    private lastInput: string = "";

    constructor(_id: number, _bind: Bind | null, _paddle: Paddle, _socket: Socket, username: string)
    {
        super(_id, _bind, _paddle, username);
        this.socket = _socket;
    }

    public handleKeyDown(event: KeyboardEvent): void
    {
        if (this.bind && this.lastInput !== "+") {    
            switch (event.key) {
                case this.bind.up:
                    this.paddle.keyDownUp();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "+UP");
                    break;
                case this.bind.down:
                    this.paddle.keyDownDown();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "+DOWN");
                    break;
                case this.bind.left:
                    this.paddle.keyDownLeft();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "+LEFT");
                    break;
                case this.bind.right:
                    this.paddle.keyDownRight();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "+RIGHT");
                    break;
                case this.bind.ready:
                    this.ready();
                    break;
                default:
                    break;
                }
                this.lastInput = "+";
        }
    }

    public handleKeyUp(event: KeyboardEvent): void
    {
        if (this.bind && this.lastInput !== "-")
        {    
            switch (event.key) {
                case this.bind.up:
                    this.paddle.keyUpY();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "-UP");
                    break;
                case this.bind.down:
                    this.paddle.keyUpY();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "-DOWN");
                    break;
                case this.bind.left:
                    this.paddle.keyUpX();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "-LEFT");
                    break;
                case this.bind.right:
                    this.paddle.keyUpX();
                    this.socket.emit(SockEvent.SE_GM_EVENT, "-RIGHT");
                    break;
                default:	
                    break;
            }
            this.lastInput = "-";
        }
    }

    public setPos(x: number, y: number): void
    {
        this.paddle.setPos(x, y);
        this.reset();
    }

    public reset(): void
    {
        this.paddle.keyUpX();
        this.paddle.keyUpY();
    }

    public ready(): void
    {
        this.isReady = true;
        this.socket.emit(SockEvent.SE_GM_READY);
    }
}