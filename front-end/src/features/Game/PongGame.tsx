import React, { useRef, useEffect } from 'react';
import { Game } from './engine/Game';
import { io, Socket } from 'socket.io-client';
import { getToken, url } from '../../api/Api';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';


const WebGame = url + '/game';
const WebMatchmaking = url + '/matchmaking';

interface PongGameProps {
    width: number;
    height: number;
    isQueue: boolean;
    spec?: string | null;
    handlefound: () => void;
}


const PongGame: React.FC<PongGameProps> = (props: PongGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const game = useRef<Game>();
    const socketGame = useRef<Socket>();
    const socketMatchmaking = useRef<Socket>();
    const userContext = useContext(UserContext);
    const user = userContext?.user;
    
    useEffect(() => {
        console.log('componentDidMount Pong');
        const newSocketGame = io(WebGame, { extraHeaders: { Authorization: getToken() as string } });
        socketGame.current = newSocketGame;
        const newSocketMatchmaking = io(WebMatchmaking, { extraHeaders: { Authorization: getToken() as string } });
        socketMatchmaking.current = newSocketMatchmaking;
        
        return () => {
            console.log('componentWillUnmount Pong');
            game.current?.leaveQueue();
            socketGame.current?.disconnect();
            socketMatchmaking.current?.disconnect();
        };
    }, []);
    
    useEffect(() => {
        console.log('componentDidUpdate Pong');
        const joinQueue = () => {
            if (!game) {
                console.log('no state game');
                return;
            }
            game.current?.joinQueue();
        };
        
        const leaveQueue = () => {
            if (!game) {
                console.log('no state game');
                return;
            }
            game.current?.leaveQueue();
        };
        
        const searchGame = () => {
            if (game === null) {
                console.log('no state game');
                return;
            }
            console.log('searching game');
            game.current?.searchGame();
        };
        function setGame() {
            const ctx = canvasRef.current?.getContext('2d');
            if (!game.current && user && ctx) {
                console.log('Game created' + socketGame, socketMatchmaking, user, ctx);
                const newGame = new Game(socketGame.current!, socketMatchmaking.current!, user, ctx);
                game.current = newGame;
            }
        }
        const handlefoundGame = () => {
            console.log('handlefoundGame');
            props.handlefound();
        };
        
        setGame();
        console.log(game.current);
        socketMatchmaking.current?.on('matchmaking:foundMatch', handlefoundGame);
        if (props.spec === null) searchGame();
        if (props.isQueue) joinQueue();
        else leaveQueue();
        
        if (props.spec) {
            game.current?.spectateGame(props.spec);
        }
    }, [props.isQueue, props.spec, props.height, props.width]);
    
    

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                width={props.width}
                height={props.height}
                style={{ width: '100%', height: '100%'}}
            />
        </div>
        );
};
export default PongGame;