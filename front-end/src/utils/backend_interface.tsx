import { Socket } from "socket.io-client";

export interface Match {
    id: number;
    scores: number[];
    winner: User;
    loser: User;
}

export interface User {
    id: number;
    socket: Socket;
    username: string;
	avatarPath: string;
    is2FAActivated: boolean;
    elo: number;
    winMatch: Match[];
    loseMatch: Match[];
    friends: User[];
    friend_requests: User[];
    blacklist: User[];
    status: number;
}

export const enum UserStatus {
    Disconnected,
    Connected,
    InGame,
}
