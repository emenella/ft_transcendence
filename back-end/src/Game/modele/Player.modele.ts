import { Paddle } from "./Paddle.modele";
import { Socket } from "socket.io";
import { emit } from "process";
import { GameInfo, Setup } from "../interface/Game.interface";

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}


export class Player {
    private id: number;
    private score: number;
    private socket: Socket;
    private isConnected: boolean;
    private isReady: boolean;
    private paddle: Paddle;

    constructor(id: number, _setup: Setup, startX: number, startY: number) {
        this.id = id;
        this.score = 0;
        this.isConnected = false;
        this.isReady = false;
        this.paddle = new Paddle(_setup.player0.color, _setup.player0.width, _setup.player0.length, startX, startY, _setup.player0.speedX, _setup.player0.speedY, _setup.general);
    }

    public playerConnect(socket: Socket, isLive: boolean) {
        this.socket = socket;
        this.isConnected = true;
        this.emitJoin();
        if (isLive) {
            this.emitLive();
        }
    }

    public playerDisconnect(isLive: boolean, opp: Player) {
        this.isConnected = false;
        this.unready(isLive, opp);
    }

    public ready(isLive: boolean, opp: Player): boolean {
        this.isReady = true;
        if (this.isReady && opp.getReady() && !isLive)
        {
            isLive = true;
            this.emitLive();
            opp.emitLive();
        }
        return isLive;
    }

    public unready(isLive: boolean, opp: Player): boolean {
        this.isReady = false;
        this.emitUnready();
        opp.emitPlayerUnReady(this.id);
        if (isLive) {
            isLive = false;
        }
        return isLive;
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

    public reset() {
        this.paddle.keyUpX();
        this.paddle.keyUpY();
    }

    private emitLive() {
        this.socket.emit("game:live");
    }

    private emitJoin() {
        this.socket.emit("game:join");
    }

    private emitUnready() {
        this.socket.emit("game:unready", this.id);
    }

    private emitPlayerUnReady(id: number) {
        this.socket.emit("game:unready", id);
    }

    public emitGameInfo(info: GameInfo) {
        this.socket.emit("game:info", info);
    }

    private emitFinish(winner: number) {
        this.socket.emit("game:finish", winner);
    }

    public move() {
        this.paddle.move();
    }

    public getScore() {
        return this.score;
    }

    public getId() {
        return this.id;
    }

    public increaseScore() {
        this.score++;
    }

    public setPos(x: number, y: number) {
        this.paddle.setPos(x, y);
    }

    public getPaddleWidth() {
        return this.paddle.getWidth();
    }

    public getPaddleLength() {
        return this.paddle.getLength();
    }

    public getReady(): boolean
    {
        return this.isReady;
    }

    public getPosX() {
        return this.paddle.getPosX();
    }

    public getPosY() {
        return this.paddle.getPosY();
    }

    public getDx() {
        return this.paddle.getDx();
    }

    public getDy() {
        return this.paddle.getDy();
    }

    public gameFinish(winner: number) {
        this.emitFinish(winner);
    }

    public goal(isLive: boolean, opp: Player): boolean {
        isLive = opp.unready(isLive, this);
        this.reset();
        this.increaseScore();
        return isLive;
    }

}