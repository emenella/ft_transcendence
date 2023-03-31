export interface Token {
	hasToken : boolean;
}

export interface isConnected {
    lougout: () => void;
}

export interface isNotConnected {
    login: (token: string) => void;
}
