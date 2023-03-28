import axios from 'axios'

export const client = axios.create({
	baseURL: "https://localhost/"
});

export function authHeader() {
	let token = localStorage.getItem("token");
	
	if (token) {
		let access_token = JSON.parse(token);
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
	localStorage.setItem("token", JSON.stringify(token));
	client.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export function getToken() {
	let token = localStorage.getItem("token")
	if (token === null)
		return null;
	return JSON.parse(token);
}
