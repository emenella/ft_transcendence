import { Paddle } from "./Paddle";
import { PlayerClient } from "./playerClient";
import { Socket } from "socket.io-client";
import { SockEvent } from "../../../utils/backendInterface";

enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export class PlayerRemote extends PlayerClient
{
    constructor(_id: number, _paddle: Paddle, _socket: Socket, username: string)
    {
        super(_id, null, _paddle, _socket, username);
        this.socket.on(SockEvent.SE_GM_EVENT, this.handleRemoteEvent.bind(this));
    }

    public handleKeyDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public handleKeyUp(event: KeyboardEvent): void {
        // Do nothing
    }

    public handleRemoteEvent(data: string): void
    {
        const keyType: string = data.substring(0, 1);
        const direction: Direction = Direction[data.substring(1) as keyof typeof Direction];
        if (keyType === "+")
        {
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
        else if (keyType === "-")
        {
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
}
