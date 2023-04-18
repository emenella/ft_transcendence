import React, { useRef, useEffect } from 'react';
import { Game } from './engine/Game';
import { io } from 'socket.io-client';
import { getToken, url } from '../../api/Api';
import { User } from './engine/interfaces/ft_pong.interface';

const WebGame = url + '/game';
const WebMatchmaking = url + '/matchmaking';

interface PongGameProps {
    width: number;
    height: number;
    token: string;
    isQueue: boolean;
    spec: string | null;
    user: User;
    handlefound: () => void;
}


const PongGame: React.FC<PongGameProps> = ({ width, height, token, isQueue, spec, user, handlefound }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socketGame = io(WebGame, { extraHeaders: { Authorization: getToken() as string } });
    const socketMatchmaking = io(WebMatchmaking, { extraHeaders: { Authorization: getToken() as string } });
    let game: Game | null = null;
    
    useEffect(() => {
        console.log('componentDidMount Pong');
        
        return () => {
            console.log('componentWillUnmount Pong');
            game?.leaveQueue();
            game?.leaveGame();
            socketGame.disconnect();
            socketMatchmaking.disconnect();
        };
    }, []);
    
    useEffect(() => {
        console.log('componentDidUpdate Pong');
        const joinQueue = () => {
            if (!game) {
                console.log('no state game');
                return;
            }
            game.joinQueue();
        };
        
        const leaveQueue = () => {
            if (!game) {
                console.log('no state game');
                return;
            }
            game.leaveQueue();
        };
        
        const searchGame = () => {
            if (game === null) {
                console.log('no state game');
                return;
            }
            game.searchGame();
        };
        function setGame() {
            const ctx = canvasRef.current?.getContext('2d');
            if (!game && user && ctx) {
                console.log('Game created' + socketGame, socketMatchmaking, user, ctx);
                const newGame = new Game(socketGame, socketMatchmaking, user, ctx);
                game = newGame;
            }
        }
        const handlefoundGame = (gameId: string) => {
            gameId;
            handlefound();
        };
        socketMatchmaking.on('matchmaking:foundMatch', handlefoundGame);
    
        setGame();
        if (spec === null) searchGame();
        if (isQueue) joinQueue();
        else leaveQueue();
        
        if (spec) {
            game?.spectateGame(spec);
        }
    }, [isQueue, spec]);
    
    

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
        );
};
export default PongGame;