export interface general {
    id: string;
    ScoreWin: number;
    Overtime: boolean;
    OvertimeScore: number;
    height: number;
    width: number;
}

export interface player {
    id: number;
    username: string;
    color: string;
    length: number;
    width: number;
    speedX: number;
    speedY: number;
}

export interface ball {
    color: string;
    radius: number;
    speed: number;
    maxSpeed: number;
}

export interface Setup {
    general: general;
    player0: player;
    player1: player;
    ball: ball;
}

export class GameInfo
{
    player0: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            width: number;
            height: number;
        };
    }
    player1: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            width: number;
            height: number;
        }
    }
    ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
        radius: number;
    }
}