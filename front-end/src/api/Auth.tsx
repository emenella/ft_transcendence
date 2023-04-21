import { client as axios } from "./Api";

export async function submitCode2FA(secret: string, access_token: string): Promise<string> {
	try {
		const req = await axios.post("/api/auth/2fa/login", { code: secret }, { headers: { Authorization: `Bearer ${access_token}` } });
		return req.data.access_token;
	}
	catch (e) {
		console.log(e);
	}
	return "";
}

export async function firstConnexion() {
	try {
		const req = await axios.get("/api/auth");
		return req.data;
	}
	catch (e) {
		console.log(e);
	}
}

export async function getQRCode(access_token: string | null) {
	try {
		if (access_token == null) {
			return;
		}
		const req = await axios.get("/api/auth/2fa/qrcode", { headers: { Authorization: `Bearer ${access_token}` } });
		return req.data as string;
	}
	catch (e) {
		console.log(e);
	}
}

export async function saveQRCode(secret: string, access_token: string): Promise<string> {
	try {
		const req = await axios.post("/api/auth/2fa/save", { code: secret }, { headers: { Authorization: `Bearer ${access_token}` } });
		return req.data.access_token;
	}
	catch (e) {
		console.log(e);
	}
	return "";
}
