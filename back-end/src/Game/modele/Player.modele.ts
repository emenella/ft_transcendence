import { Paddle } from "./Paddle.modele";
import { Socket } from "socket.io";

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}


export class Player {
    public id: number;
    public score: number;
    public socket: Socket;
    public isConnected: boolean;
    public isReady: boolean;
    public paddle: Paddle;

    constructor(id: number, paddle: Paddle) {
        this.id = id;
        this.score = 0;
        this.isConnected = false;
        this.isReady = false;
        this.paddle = paddle;
    }

    public press(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.paddle.keyDownUp();
                break;
            case Direction.DOWN:
                this.paddle.keyDownDown();
                break;
            case Direction.LEFT:
                this.paddle.keyDownLeft();
                break;
            case Direction.RIGHT:
                this.paddle.keyDownRight();
                break;
        }
    }

    public unpress(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.paddle.keyUpY();
                break;
            case Direction.DOWN:
                this.paddle.keyUpY();
                break;
            case Direction.LEFT:
                this.paddle.keyUpX();
                break;
            case Direction.RIGHT:
                this.paddle.keyUpX();
                break;
        }
    }
}