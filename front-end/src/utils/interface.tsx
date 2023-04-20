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

export interface emojiProps {
    label: string;
    symbol: any;
}
