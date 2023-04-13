export interface Avatar {
    path: string;
}

export interface Match {
    id: number;
    scores: number[];
    winner: User;
    looser: User;
}

export interface User {
    id: number;
    username: string;
    avatar: Avatar;
    elo: number;
    winMatch: Match[];
    looseMatch: Match[];
    friends: User[];
    friend_invites: User[];
    blacklist: User[];
}
