import axios from 'axios';

const protocol = process.env.REACT_APP_API_PROTOCOL
const host = process.env.REACT_APP_API_HOST
const port = process.env.REACT_APP_API_PORT

export const client = axios.create({
	baseURL: `${protocol}://${host}:${port}`,
});

export function authHeader(type?: string) {
	let token = localStorage.getItem("token");
	
	if (token) {
		let access_token = token;
		return {
			"Content-Type": type ? type : "application/json",
			"Authorization": "Bearer " + access_token
		};
	}
	return {
		"Content-Type": type ? type : "application/json",
		"Authorization": null
	};
}

export function setToken(token: string) {
	localStorage.setItem("token", token);
	client.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export function getToken() {
	let token = localStorage.getItem("token")
	if (token === null)
		return null;
	return token;
}
