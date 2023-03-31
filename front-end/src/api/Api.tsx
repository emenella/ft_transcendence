import axios from 'axios'

export const client = axios.create({
	baseURL: "https://localhost/"
});

export function authHeader() {
	let token = localStorage.getItem("token");
	
	if (token) {
		let access_token = token;
		return {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + access_token
		};
	}
	return {
		"Content-Type": "application/json",
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
