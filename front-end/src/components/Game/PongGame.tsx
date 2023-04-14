import React, { Component, createRef, useEffect } from 'react';
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
    isQueue: boolean;
    spec: string | null;
}

interface PongGameState {
    me: User | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    isQueue: boolean;
}


const WebMatchmaking = url + '/matchmaking';

class PongGame extends Component<PongGameProps, PongGameState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    socketGame: Socket;
    socketMatchmaking: Socket;
    game: Game | null = null;

    constructor(props: PongGameProps) {
        super(props);
        this.canvasRef = createRef();
        this.socketGame = io(WebGame, { extraHeaders: { Authorization: props.token } });
        this.socketMatchmaking = io(WebMatchmaking, { extraHeaders: { Authorization: props.token } });
        this.state = {
            me: null,
            canvasRef: this.canvasRef,
            isQueue: props.isQueue,
        };
    }

    componentDidMount() {
        console.log('componentDidMount Pong');
        this.fetchUser();
    }

    async fetchUser() {
        const user = await getMe();
        console.log(user);
        this.setState({ me: user });
    }

    componentDidUpdate(prevProps: PongGameProps, prevState: PongGameState) {
        console.log('componentDidUpdate Pong');
        this.setGame();
        if (this.props.spec === null)
            this.searchGame();
        if (this.props.isQueue)
        {
            this.joinQueue();
        }
        else
        {
            this.leaveQueue();
        }

        if (this.props.spec)
        {
            this.game?.spectateGame(this.props.spec);
        }
    }

    setGame() {
        const { me } = this.state;
        const ctx = this.canvasRef.current?.getContext('2d');
        if (!this.game && me && ctx) {
            console.log('Game created' + this.socketGame, this.socketMatchmaking, me, ctx);
            const newGame = new Game(this.socketGame, this.socketMatchmaking, me, ctx);
            this.game = newGame;
        }
    }

    joinQueue = () => {
        if (!this.game) {
            console.log('no state game');
            return;
        }
        this.game.joinQueue();
    };

    leaveQueue = () => {
        if (!this.game) {
            console.log('no state game');
            return;
        }
        this.game.leaveQueue();
    };

    searchGame = () => {
        if (this.game === null) {
            console.log('no state game');
            return;
        }
        this.game.searchGame();
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