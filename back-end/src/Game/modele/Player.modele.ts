import { Paddle } from "./Paddle.modele";
import { Socket } from "socket.io";
import { GameInfo, Setup, player } from "../interface/Game.interface";
import { SockEvent } from "../../Socket/Socket.gateway";

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

    private lastInput: string = "";

    private timeout: any;

    constructor(id: number, _setup: Setup, startX: number, startY: number) {
        this.id = id;
        this.score = 0;
        this.isConnected = false;
        this.isReady = false;
        this.paddle = new Paddle(_setup.player0.color, _setup.player0.width, _setup.player0.length, startX, startY, _setup.player0.speedX, _setup.player0.speedY, _setup.general);
    }

    public playerConnect(socket: Socket, isLive: boolean, gameSetup: Setup) {
        this.socket = socket;
        this.isConnected = true;
        this.emitJoin(gameSetup);
        if (isLive) {
            this.emitLive();
        }
    }

    public playerDisconnect(): boolean {
        this.isConnected = false;
        return true;
    }

    public ready(isLive: boolean, opp: Player): boolean {
        this.isReady = true;
        if (this.isReady && opp.getReady() && !isLive)
        {
            isLive = true;
            this.emitLive();
            opp.emitLive();
        }
        clearInterval(this.timeout);
        return isLive;
    }

    public unready(opp: Player, surrend: (player: Player) => Promise<void>): boolean {
        this.isReady = false;
        this.emitUnready();
        opp.emitPlayerUnReady(this.id);
        this.timeout = setTimeout(() => {surrend(this)}, 5000);
        return false;
    }

    public press(direction: Direction, opponent: Player) {
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
        if (this.lastInput !== "+") {
            this.lastInput = "+";
            opponent.emitPlayerMove(this.lastInput + direction);
        }
    }

    public unpress(direction: Direction, opponent: Player) {
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
        if (this.lastInput !== "-") {
            this.lastInput = "-";
            opponent.emitPlayerMove(this.lastInput + direction);
        }
    }

    public reset() {
        this.paddle.keyUpX();
        this.paddle.keyUpY();
    }

    private emitLive() {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_LIVE);
    }

    private emitJoin(gameSetup: Setup) {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_JOIN, gameSetup);
    }

    private emitUnready() {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_UNREADY, this.id);
    }

    private emitPlayerUnReady(id: number) {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_UNREADY, id);
    }

    public emitGameInfo(info: GameInfo) {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_INFO, info);
    }

    private emitFinish(winner: number) {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_FINISH, winner);
    }

    public emitPlayerMove(direction: string) {
        if (this.isConnected)
            this.socket.emit(SockEvent.SE_GM_EVENT, direction);
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

    public goal(opp: Player, surrend: (player: Player) => Promise<void>): boolean {
        opp.unready(this, surrend);
        this.reset();
        opp.reset();
        this.increaseScore();
        return false;
    }

    public getSocketId() {
        return this.socket === undefined ? undefined : this.socket.id;
    }

    public clearSurrend()
    {
        clearInterval(this.timeout);
    }

}