import { Socket } from 'socket.io';
import { Game } from './Game.modele';
import { GameInfo, Setup } from '../interface/Game.interface';
import { SockEvent } from '../../Socket/Socket.gateway';

export class Spectator {
    private id: number;
    private socket: Socket;

    constructor(id: number, socket: Socket, game: Game) {
        this.id = id;
        this.socket = socket;
        this.emitJoin(game.getSetup());
        this.emitGameInfo(game.getGameInfo());
    }

    public sendGameUpdate(gameInfo: GameInfo): void {
        this.socket.emit(SockEvent.SE_GM_INFO, gameInfo);
    }

    public getId(): number {
        return this.id;
    }

    public emitFinish(winner: number) {
        this.socket.emit(SockEvent.SE_GM_FINISH, winner);
    }

    public emitGameInfo(info: GameInfo) {
        this.socket.emit(SockEvent.SE_GM_INFO, info);
    }

    public emitJoin(gameSetup: Setup) {
        this.socket.emit(SockEvent.SE_GM_JOIN, gameSetup);
    }

    public getSocketId() {
        return this.socket.id;
    }

}