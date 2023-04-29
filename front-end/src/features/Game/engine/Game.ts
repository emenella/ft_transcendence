import { Socket } from "socket.io-client";
import { ft_pong } from "./ft_pong";
import { GameSettings, Setup } from "./interfaces/ft_pong.interface";
import { User } from "../../../utils/backendInterface";
import { SockEvent } from "../../../utils/backendInterface";
import { Player } from "./player";


export const defaultGameSettings: GameSettings = {
    bind: {
        up: "w",
        down: "s",
        left: "a",
        right: "d",
        ready: " "
    },
    width: 0,
    height: 0,
    user: null,
}

export class Game {
    private socketGame: Socket;
    private socketMatchmaking: Socket;
    private pong: ft_pong | null;
    private gameFind: Array<string>;
    private ctx: CanvasRenderingContext2D;
    private gameSettings: GameSettings;
    private isSpec: boolean;


    constructor(socket: Socket, socketMatch: Socket, user: User, ctx: CanvasRenderingContext2D) {
        this.socketGame = socket;
        this.socketMatchmaking = socketMatch;
        this.ctx = ctx;
        this.pong = null;
        this.gameSettings = defaultGameSettings;
        this.gameSettings.user = user;
        this.gameSettings.width = ctx.canvas.width;
        this.gameSettings.height = ctx.canvas.height;
        this.gameFind = [];
        this.isSpec = false;
        this.socketGame.on(SockEvent.SE_GM_SEARCH, this.handleSearchGame.bind(this));
        this.socketGame.on(SockEvent.SE_GM_JOIN, this.handleJoinGame.bind(this));
        this.socketGame.on(SockEvent.SE_GM_FINISH, this.handleFinishGame.bind(this));
        this.socketMatchmaking.on(SockEvent.SE_MM_FOUND, this.handleQueue.bind(this));
    }

    public searchGame() {
        this.socketGame = this.socketGame.emit(SockEvent.SE_GM_SEARCH);
    }

    public getSearchGame() {
        return this.gameFind;
    }

    public joinGame(gameId: string) {
        this.socketGame.emit(SockEvent.SE_GM_JOIN, gameId);
    }

    public leaveGame() {
        if (this.pong) {
            this.socketGame.emit(SockEvent.SE_GM_LEAVE);
            this.pong.stop();
        }
    }

    public spectateGame(id: string) {
        this.isSpec = true;
        this.socketGame.emit(SockEvent.SE_GM_SEARCH, id);
    }

    private handleJoinGame(gameSetup: Setup) {
        if (!this.pong) {
            this.pong = new ft_pong(this.socketGame, this.gameSettings, this.ctx, gameSetup, this.isSpec);
        }
        else {
            this.pong.stop();
            this.pong = new ft_pong(this.socketGame, this.gameSettings, this.ctx, gameSetup, this.isSpec);
        }
    }

    private handleSearchGame(ids: string[]) {
        this.gameFind = ids;
        if (ids.length > 0)
            this.joinGame(ids[0]);
    }

    public joinQueue() {
        this.socketMatchmaking.emit(SockEvent.SE_MM_JOIN);
    }

    public leaveQueue() {
        this.socketMatchmaking.emit(SockEvent.SE_MM_LEAVE);
    }

    private handleQueue(id: string) {
        this.joinGame(id);
    }

    private handleFinishGame(winner: number) {
        this.pong?.screenFinish(winner);
        setTimeout(() => {
            if (this.pong) {
                this.pong.stop();
                this.pong = null;
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            }
        }, 10000);
    }

    public stop() {
        if (this.pong) {
            this.pong.stop();
            this.pong = null;
        }
    }
}