import { Socket } from 'socket.io';
import { Game } from './Game.modele';

export class Spectator {
    public id: number;
    public socket: Socket;
    public game: Game;

    constructor(id: number, socket: Socket, game: Game) {
        this.id = id;
        this.socket = socket;
        this.game = game;
        this.handleConnection();
        this.handleDisconnection();
    }

    public handleDisconnection(): void {
        this.socket.on('disconnect', () => {
            console.log('Spectator disconnected');
            this.game.spectatorDisconnect(this.id);
        });
    }

    public handleConnection(): void {
        this.socket.on('connect', () => {
            console.log('Spectator connected');
        });
    }

    public sendGameUpdate(): void {
        this.socket.emit('game:update', this.game.getGameInfo());
    }

}