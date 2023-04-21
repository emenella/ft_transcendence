import { Socket } from "socket.io-client";

export interface User {
    id: number;
    username: string;
	avatarPath: string;
    isProfileComplete: boolean;
    is2FAActivated: boolean;
    elo: number;
    matchsWon: Match[];
    matchsLost: Match[];
    friends: User[];
    friendRequests: User[];
    blacklist: User[];
    status: number;
}

export const enum UserStatus {
    Disconnected,
    Connected,
    InGame,
}

export interface Match {
    id: number;
    scores: number[];
    winner: User;
    loser: User;
}
