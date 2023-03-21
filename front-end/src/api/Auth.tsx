import { cp } from 'fs';
import { client as axios, setToken} from './Api';

export async function submitCode2FA(secret: string, access_token: string) {
	try {
		const req = await axios.post('/api/auth/2fa/login', { code: secret }, { headers: { Authorization: `Bearer ${access_token}` }});
		setToken(req.data.access_token);
	}
	catch(e) {
		console.log(e);
	}
}

export async function firstConnexion() {
	try {
		const req = await axios.get('/api/auth');
		return req.data;
	}
	catch(e) {
		console.log(e);
	}
}

export async function login(id: number): Promise<void> {
	let json = { user: { id: id } };
	let user = await fetch("https://localhost/api/auth/admin", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(json),
	});
	setToken(await user.json().then(s => s.access_token) as string);
}

export async function getQRCode(access_token: string | null) {
	try {
		if (access_token == null) {
			return;
		}
		const req = await axios.get('/api/auth/2fa/qrcode', { headers: { Authorization: `Bearer ${access_token}` }});
		return req.data as string;
	}
	catch(e) {
		console.log(e);
	}
}

export async function saveQRCode(secret: string, access_token: string) {
	try {
		const req = await axios.post('/api/auth/2fa/save', { code: secret }, { headers: { Authorization: `Bearer ${access_token}` }});
		setToken(req.data.access_token);
	}
	catch (e) {
		console.log(e);
	}
}
