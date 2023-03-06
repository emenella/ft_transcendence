import { Socket } from 'socket.io';
import { Game } from './Game.modele';
import { GameInfo, Setup } from '../interface/Game.interface';
import { emit } from 'process';

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
        this.socket.emit('game:info', gameInfo);
    }

    public getId(): number {
        return this.id;
    }

    public emitFinish(winner: number) {
        this.socket.emit('game:finish', winner);
    }

    public emitGameInfo(info: GameInfo) {
        this.socket.emit('game:info', info);
    }

    public emitJoin(gameSetup: Setup) {
        this.socket.emit('game:join', gameSetup);
    }



}