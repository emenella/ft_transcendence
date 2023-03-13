import { client as axios, authHeader} from './Api';

export async function connexion() {
	try {
		const req = await axios.post('/api/auth/2fa/login');
		return req.data;
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

export async function login(id: number): Promise<string> {
	let json = { user: { id: id } };
	let user = await fetch("https://localhost/api/auth/admin", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(json),
	});
	return await user.json().then(s => s.access_token) as string;
}

export async function getQRCode() {
	try {
		const req = await axios.get('/api/auth/2fa/qrcode', { headers: authHeader() });
		return req.data as string;
	}
	catch(e) {
		console.log(e);
	}
}

export async function saveQRCode(secret: string) {
	try {
		await axios.post('/api/auth/2fa/save', { code: secret }, { headers: authHeader() } );
	}
	catch (e) {
		console.log(e);
	}
}
