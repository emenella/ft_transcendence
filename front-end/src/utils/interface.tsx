export interface Token {
	hasToken : boolean;
}

export interface isConnected {
    logout: () => void;
}

export interface isNotConnected {
    login: (token: string) => void;
}
