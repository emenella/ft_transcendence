export interface Match {
    id: number;
    scores: number[];
    winner: User;
    loser: User;
}

export interface User {
    id: number;
    username: string;
	avatarPath: string;
    is2FAActivated: boolean;
    elo: number;
    winMatch: Match[];
    loseMatch: Match[];
    friends: User[];
    friend_requests: User[];
    blacklist: User[];
    isConnected : boolean;
    isPlaying : boolean;
    isProfileComplete : boolean;
    status: number;
}

export const enum UserStatus {
    Disconnected,
    Connected,
    InGame,
    Inactive
}
