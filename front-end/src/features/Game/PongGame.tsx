import React, { useRef, useEffect } from 'react';
import { Game } from './engine/Game';
import { io, Socket } from 'socket.io-client';
import { getJwtCookie, url } from '../../api/JwtCookie';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { SocketContext } from '../../utils/SocketContext';


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
    const socketGame = useContext(SocketContext);
    const user = useContext(UserContext)?.user;

    console.log(socketGame)
    
    useEffect(() => {
        
        return () => {
            game.current?.leaveQueue();
        };
    }, []);
    
    useEffect(() => {
        const joinQueue = () => {
            if (!game) {
                return;
            }
            game.current?.joinQueue();
        };
        
        const leaveQueue = () => {
            if (!game) {
                return;
            }
            game.current?.leaveQueue();
        };
        
        const searchGame = () => {
            if (game === null) {
                return;
            }
            game.current?.searchGame();
        };
        function setGame() {
            const ctx = canvasRef.current?.getContext('2d');
            if (!game.current && user && ctx) {
                const newGame = new Game(socketGame!, socketGame!, user, ctx);
                game.current = newGame;
            }
        }
        const handlefoundGame = () => {
            props.handlefound();
        };
        
        setGame();
        socketGame?.on('matchmaking:foundMatch', handlefoundGame);
        if (props.spec === null) searchGame();
        if (props.isQueue) joinQueue();
        else leaveQueue();
        
        if (props.spec) {
            game.current?.spectateGame(props.spec);
        }
    }, [props.isQueue, props.spec, props.height, props.width, user]);
    
    

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