import { Socket } from 'socket.io';
import { Game } from './Game.modele';

export class Spectator {
    private id: number;
    private socket: Socket;
    private game: Game;

    constructor(id: number, socket: Socket, game: Game) {
        this.id = id;
        this.socket = socket;
        this.game = game;
        this.handleDisconnection();
    }

    public handleDisconnection(): void {
        this.socket.on('disconnect', () => {
            console.log('Spectator disconnected');
            this.game.spectatorDisconnect(this.id);
        });
    }

    public sendGameUpdate(): void {
        this.socket.emit('game:update', this.game.getGameInfo());
    }

    public getId(): number {
        return this.id;
    }

}