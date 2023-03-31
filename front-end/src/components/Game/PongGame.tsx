import React, { Component } from "react";
import { Game } from './engine/Game';
import { Socket, io } from 'socket.io-client';
import { getMe } from '../../api/User';
import { User } from './engine/interfaces/ft_pong.interface';
import { cp } from "fs";


const WebGame = "https://localhost/game";
const WebMatchmaking = "https://localhost/matchmaking";

interface PongGameProps {
    width: number;
    height: number;
    token: string;
}

interface PongGameState {
    game: Game | null;
    me: User | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}


class PongGame extends Component<PongGameProps, PongGameState> {
    private ctx: CanvasRenderingContext2D | undefined | null;
    private socketGame: Socket;
    private socketMatchmaking: Socket;

    constructor(props: PongGameProps) {
        super(props);
        this.state = {
            me: null,
            canvasRef: React.createRef(),
            game: null
        };
        this.socketGame = io(WebGame, { extraHeaders: { Authorization: this.props.token } });
        this.socketMatchmaking = io(WebMatchmaking, { extraHeaders: { Authorization: this.props.token } });
    }

    async setGame() {
        this.ctx = this.state.canvasRef.current?.getContext('2d');
        if (!this.state.me || !this.ctx)
            return;
        let game = new Game(this.socketGame, this.socketMatchmaking, this.state.me, this.ctx);
        this.setState({ game: game });
    }

    async getUser () {
        const user = await getMe();
        console.log(user);
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

    async searchGame() {
        console.log(this.state.game);
        if (!this.state.game)
            return;
        this.state.game.searchGame();
    }

    async componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<PongGameState>, snapshot?: any) {
        if (this.state.me && !this.state.game) {
            this.setGame();
        }
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
