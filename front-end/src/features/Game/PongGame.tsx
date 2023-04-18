import React, { useRef, useEffect } from 'react';
import { Game } from './engine/Game';
import { io } from 'socket.io-client';
import { getToken, url } from '../../api/Api';
import { User } from '../../utils/backend_interface';

const WebGame = url + '/game';
const WebMatchmaking = url + '/matchmaking';

interface PongGameProps {
    width: number;
    height: number;
    isQueue: boolean;
    spec?: string | null;
    user: User;
}


const PongGame: React.FC<PongGameProps> = (props: PongGameProps) => {
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
            if (!game && props.user && ctx) {
                console.log('Game created' + socketGame, socketMatchmaking, props.user, ctx);
                const newGame = new Game(socketGame, socketMatchmaking, props.user, ctx);
                game = newGame;
            }
        }
    
        setGame();
        if (props.spec === null) searchGame();
        if (props.isQueue) joinQueue();
        else leaveQueue();
        
        if (props.spec) {
            game?.spectateGame(props.spec);
        }
    }, [props.isQueue, props.spec]);
    
    

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                width={props.width}
                height={props.height}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
        );
};
export default PongGame;