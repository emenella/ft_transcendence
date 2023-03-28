import React, { Component } from "react";
import { Game } from './engine/Game';
import { Socket, io } from 'socket.io-client';
import { getMe } from '../../api/User';
import { User } from './engine/interfaces/ft_pong.interface';


const WebGame = "https://localhost/game";
const WebMatchmaking = "https://localhost/matchmaking";

interface PongGameProps {
    width: number;
    height: number;
    token: string;
}

interface PongGameState {
    game: Game | null;
    socketGame: Socket;
    socketMatchmaking: Socket;
    me: User | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}


class PongGame extends Component<PongGameProps, PongGameState> {
    private ctx: CanvasRenderingContext2D | undefined | null;

    constructor(props: PongGameProps) {
        super(props);
        this.state = {
            socketGame: io(WebGame, { extraHeaders: { Authorization: this.props.token } }),
            socketMatchmaking: io(WebMatchmaking, { extraHeaders: { Authorization: this.props.token } }),
            me: null,
            canvasRef: React.createRef(),
            game: null
        };
    }

    async setGame() {
        this.ctx = this.state.canvasRef.current?.getContext('2d');
        this.getUser();
        if (!this.state.me || !this.ctx)
            return;
        let game = new Game(this.state.socketGame, this.state.socketMatchmaking, this.state.me, this.ctx);
        this.setState({ game: game});
    }

    async getUser () {
        const user = await getMe();
        this.setState({ me: user });
    }

    async joinQueue() {
        if (!this.state.game)
            return;
        this.state.game.joinQueue();
    }

    async leaveQueue() {
        if (!this.state.game)
            return;
        this.state.game.leaveQueue();
    }

    async searcheGame() {
        if (!this.state.game)
            return;
        this.state.game.searchGame();
    }

    componentDidMount() {
        this.setGame();
    }


    render() {
        return (
            <div>
                <canvas ref={this.state.canvasRef} width={this.props.width} height={this.props.height} />
            </div>
        );
    }
}

export default PongGame;
