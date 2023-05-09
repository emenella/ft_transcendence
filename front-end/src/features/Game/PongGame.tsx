import React, { useRef, useEffect } from 'react';
import { Game } from './engine/Game';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { SocketContext } from '../../utils/SocketContext';
import { SockEvent } from '../../utils/backendInterface';


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
        console.log("useEffect did mount")
        
        return () => {
            game.current?.leaveQueue();
            game.current?.leaveGame();
            game.current?.stop();
        };
    }, []);
    
    useEffect(() => {
        console.log("useEffect did update")
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
        
        
        socketGame?.on(SockEvent.SE_MM_FOUND, handlefoundGame.bind(this));
        setGame();
        if (props.spec === null) searchGame();
        if (props.isQueue) joinQueue();
        else leaveQueue();
        
        if (props.spec) {
            game.current?.spectateGame(props.spec);
        }
    }, [props.isQueue, props.spec, user, socketGame]);
    
    

    return (
        <div >
            <canvas
                ref={canvasRef}
                width={props.width}
                height={props.height}
            />
        </div>
        );
};
export default PongGame;