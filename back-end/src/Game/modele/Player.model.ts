import { Paddle } from "./Paddle";

enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}


export class Player {
    protected name: string;
    public score: number;
    public paddle: Paddle;

    constructor(name: string, paddle: Paddle) {
        this.name = name;
        this.score = 0;
        this.paddle = paddle;
    }

    public move(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.paddle.moveUp();
                break;
            case Direction.DOWN:
                this.paddle.moveDown();
                break;
            case Direction.LEFT:
                this.paddle.moveLeft();
                break;
            case Direction.RIGHT:
                this.paddle.moveRight();
                break;
        }
    }

}