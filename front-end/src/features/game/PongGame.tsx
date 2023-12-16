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

    useEffect(() => {
        const handlefoundGame = () => {
            props.handlefound();
        };

        function setGame() {
            const ctx = canvasRef.current?.getContext('2d');
            if (game.current === undefined && user && ctx) {
                const newGame = new Game(socketGame!, socketGame!, user, ctx);
                game.current = newGame;
            }
        }

        const searchGame = () => {
            if (game === null) {
                return;
            }
            game.current?.searchGame();
        };

        setGame();
        socketGame?.on(SockEvent.SE_MM_FOUND, handlefoundGame.bind(this));
        socketGame?.on(SockEvent.SE_GM_DUEL_LAUNCH, searchGame.bind(this));
        return () => {
            socketGame?.off(SockEvent.SE_MM_FOUND, handlefoundGame.bind(this));
            socketGame?.off(SockEvent.SE_GM_DUEL_LAUNCH, searchGame.bind(this));
            game.current?.leaveQueue();
            game.current?.leaveGame();
            game.current?.stop();
        };
    }, [socketGame]);

    useEffect(() => {
        const joinQueue = () => {
            game.current?.joinQueue();
        };

        const leaveQueue = () => {
            game.current?.leaveQueue();
        };

        game.current?.searchGame();
        if (props.isQueue) joinQueue();
        else leaveQueue();

    }, [props, game]);



    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
                width={props.width}
                height={props.height}
            />
        </div>
    );
};

export default PongGame;
