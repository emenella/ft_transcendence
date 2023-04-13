import { Socket } from "socket.io-client";
import { ft_pong } from "./ft_pong";
import { Bind, User, GameSettings, Setup } from "./interfaces/ft_pong.interface";



export const defaultGameSettings: GameSettings = {
    bind: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
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
        this.socketGame.on("game:search", this.handleSearchGame.bind(this));
        this.socketGame.on("game:join", this.handleJoinGame.bind(this));
        this.socketMatchmaking.on("matchmaking:foundMatch", this.handleQueue.bind(this));
        console.log(this.socketMatchmaking);
    }

    public searchGame() {
        this.socketGame = this.socketGame.emit("game:search");
    }

    public getSearchGame() {
        return this.gameFind;
    }

    public joinGame(gameId: string) {
        console.log(gameId);
        this.socketGame.emit("game:join", gameId);
    }

    public leaveGame() {
        if (this.pong) {
            this.socketGame.emit("game:leave");
            this.pong.stop();
        }
    }

    public spectateGame(id: string) {
        this.socketGame.emit("game:spec", id);
    }

    private handleJoinGame(gameSetup: Setup) {
        console.log(gameSetup);
        if (!this.pong) {
            this.pong = new ft_pong(this.socketGame, this.gameSettings, this.ctx, gameSetup);
        }
        else {
            this.pong.stop();
            this.pong = new ft_pong(this.socketGame, this.gameSettings, this.ctx, gameSetup);
        }
    }

    private handleSearchGame(ids: string[]) {
        this.gameFind = ids;
        if (ids.length > 0)
            this.joinGame(ids[0]);
    }

    public joinQueue() {
        console.log("join");
        this.socketMatchmaking.emit("matchmaking:join");
    }

    public leaveQueue() {
        console.log("leave");
        this.socketMatchmaking.emit("matchmaking:leave");
    }

    private handleQueue(id: string) {
        console.log("found match");
        this.joinGame(id);
    }
}