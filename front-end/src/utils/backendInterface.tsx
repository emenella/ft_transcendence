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
	SE_UPDATE_FRONT = 'updateFront',
	//~~ Matchmaking
	SE_MM_LEAVE = 'mm:leave',
	SE_MM_JOIN = 'mm:join',
	SE_MM_FOUND = 'mm:foundMatch',
	//~~ Game
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
	SE_GM_DUEL_SEND = 'gm:duelSend',
	SE_GM_DUEL_SUCCESS = 'gm:duelSendTrue',
	SE_GM_DUEL_FAILURE = 'gm:duelSendFalse',
	SE_GM_DUEL_RECEIVE = 'gm:duelReceive',
	SE_GM_DUEL_ACCEPT = 'gm:duelAccept',
	SE_GM_DUEL_DENY = 'gm:duelDeny',
	SE_GM_DUEL_DENIED = 'gm:duelDenied',
	SE_GM_DUEL_LAUNCH = 'gm:duelLaunch',
	//~~ Chat
	SE_CH_MSG = 'ch:msg',
	SE_CH_JOIN = 'ch:join',
	SE_CH_LEAVE = 'ch:leave',
	SE_CH_CREATE = 'ch:create',
	//~~ User
	SE_US_STATUS = 'us:status'
}
