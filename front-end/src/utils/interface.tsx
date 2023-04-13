import { User } from "./backend_interface";

export interface Token {
	hasToken : boolean;
}

export interface isConnected {
    logout: () => void;
}

export interface isNotConnected {
    login: (token: string) => void;
}

export interface ConnexionProps {
	access_code: string;
	navigate: any;
}

export interface QRCodeFormProps {
	qrcode: string;
	accessToken: string;
	navigate: any;
}

export interface QRCodeFormState {
	secret: string;
}

export interface UsernameFormProps {
	navigate: any;
}

export interface UsernameFormState {
	username: string;
}

export interface AccountManagementState {
	username : string;
	image: File | undefined;
}

export interface emojiProps {
    label: string;
    symbol: any;
}
