export interface Avatar {
    path: string;
}

export interface Match {
    id: number;
    scores: number[];
    winner: User;
    loser: User;
}

export interface User {
    id: number;
    username: string;
    avatar: Avatar;
    is2FAActivated: boolean;
    elo: number;
    winMatch: Match[];
    looseMatch: Match[];
    friends: User[];
    friend_requests: User[];
    blacklist: User[];
    isConnected : boolean;
    isPlaying : boolean;
}
