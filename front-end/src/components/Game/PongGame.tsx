import React, { Component, createRef } from 'react';
import { Game } from './engine/Game';
import { Socket, io } from 'socket.io-client';
import { getMe } from '../../api/User';
import { url } from '../../api/Api';
import { User } from './engine/interfaces/ft_pong.interface';

const WebGame = url + '/game';

interface PongGameProps {
    width: number;
    height: number;
    token: string;
    socketMatchmaking: Socket
}

interface PongGameState {
    game: Game | null;
    me: User | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

class PongGame extends Component<PongGameProps, PongGameState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    socketGame: Socket;

    constructor(props: PongGameProps) {
        super(props);
        this.canvasRef = createRef();
        this.socketGame = io(WebGame, { extraHeaders: { Authorization: props.token } });
        this.state = {
            game: null,
            me: null,
            canvasRef: this.canvasRef
        };
    }

    componentDidMount() {
        this.fetchUser();
    }

    async fetchUser() {
        const user = await getMe();
        console.log(user);
        this.setState({ me: user });
    }

    componentDidUpdate(prevProps: PongGameProps, prevState: PongGameState) {
        const { me } = this.state;
        const ctx = this.canvasRef.current!.getContext('2d');
        if (me && ctx && !prevState.me) {
            const newGame = new Game(this.socketGame, this.props.socketMatchmaking, me, ctx);
            this.setState({ game: newGame });
        }
    }

    joinQueue = () => {
        const { game } = this.state;
        if (!game) {
            return;
        }
        game.joinQueue();
    };

    leaveQueue = () => {
        const { game } = this.state;
        if (!game) {
            return;
        }
        game.leaveQueue();
    };

    searchGame = () => {
        const { game } = this.state;
        if (!game) {
            console.log('no state game');
            return;
        }
        game.searchGame();
    };

    render() {
        const { width, height } = this.props;
        return (
            <div>
                <canvas ref={this.canvasRef} width={width} height={height} />
            </div>
        );
    }
}

export default PongGame;