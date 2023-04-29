import { Paddle } from "./Paddle";
import { PlayerClient } from "./playerClient";
import { Socket } from "socket.io-client";


export class PlayerRemote extends PlayerClient
{
    constructor(_id: number, _paddle: Paddle, _socket: Socket, username: string)
    {
        super(_id, null, _paddle, _socket, username);
    }

    public handleKeyDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public handleKeyUp(event: KeyboardEvent): void {
        // Do nothing
    }
}
