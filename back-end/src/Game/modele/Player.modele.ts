import { Paddle } from "./Paddle.modele";

enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}


export class Player {
    public name: string;
    public score: number;
    public paddle: Paddle;

    constructor(name: string, paddle: Paddle) {
        this.name = name;
        this.score = 0;
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