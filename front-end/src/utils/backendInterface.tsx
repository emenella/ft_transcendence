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

export enum SockEvent {
	SE_CH_MSG = 'ch:msg',
	SE_CH_JOIN = 'ch:join',
	SE_CH_LEAVE = 'ch:leave',
	SE_CH_CREATE = 'ch:create',
    SE_FR_INVITE = 'fr:invite',
	SE_FR_ACCEPT = 'fr:accept',
	SE_FR_DENY = 'fr:deny',
	SE_FR_REMOVE = 'fr:remove',
	SE_BL_ADD = 'bl:add',
	SE_BL_REMOVE = 'bl:remove',
    SE_COLOR = "color",
    SE_FRONT_NOTIFY = "front:notify"
}
