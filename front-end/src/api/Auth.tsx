import { client as axios, loginUrl } from "./JwtCookie";

export function get42URL() {
	return loginUrl;
}

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

export async function loginWith42(id: number): Promise<string> {
	try {
		const req = await axios.post("/api/auth/admin", {
			"user": {
				"id": id
			}
		});
		return req.data.access_token;
	}
	catch (e) {
		console.log(e);
	}
	return "";
}
