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

export enum SockEvent
{
    SE_MM_LEAVE = 'mm:leave',
    SE_MM_JOIN = 'mm:join',
    SE_MM_FOUND = 'mm:foundMatch',
	SE_GM_EVENT = 'gm:event',
	SE_GM_JOIN = 'gm:join',
	SE_GM_SEARCH = 'gm:search',
	SE_GM_LEAVE = 'gm:leave',
	SE_GM_READY = 'gm:ready',
	SE_GM_UNREADY = 'gm:unready',
	SE_GM_INFO = 'gm:info',
	SE_GM_FINISH = 'gm:finish',
	SE_GM_LIVE = 'gm:live',
	SE_GM_SPEC = 'gm:spec',
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
	SE_FRONT_NOTIFY = "front:notify",
	SE_FRONT_UPDATE = "front:update"
}
