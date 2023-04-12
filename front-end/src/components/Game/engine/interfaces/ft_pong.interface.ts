export interface General {
    id: string;
    ScoreWin: number;
    Overtime: boolean;
    OvertimeScore: number;
    height: number;
    width: number;
}

export interface Player {
    id: number;
    username: string;
    color: string;
    length: number;
    width: number;
    x: number;
    y: number;
    speedX: number;
    speedY: number;
}

export interface Ball {
    color: string;
    radius: number;
    speed: number;
    maxSpeed: number;
}

export interface GameInfo
{
    player0: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
        };
    }
    player1: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
        }
    }
    ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
    }
}

export interface Setup {
    general: General;
    player0: Player;
    player1: Player;
    ball: Ball;
}

export interface Bind {
    up: string;
    down: string;
    left: string;
    right: string;
    ready: string;
}

export interface User {
    id: number;
    username: string;
    isProfileComplete: boolean;
    elo: number;
}

export interface GameSettings {
    user: User | null;
    bind: Bind;
    width: number;
    height: number;
}