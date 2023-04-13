export interface Avatar {
    path: string;
}

export interface MatchHistory {
    id: number;
    scores: number[];
    winner: User;
    looser: User;
}

export interface User {
    id: number;
    username: string;
    avatar: Avatar;
    is2FAActivated: boolean;
    elo: number;
    winMatch: MatchHistory[];
    looseMatch: MatchHistory[];
    friends: User[];
    friend_invites: User[];
    blacklist: User[];
}
