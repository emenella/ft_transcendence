import axios from 'axios'

export const client = axios.create({
	baseURL: "https://localhost/"
});

export function authHeader() {
	let token = localStorage.getItem("token");
	
	if (token) {
		token = JSON.parse(token);
		return {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
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
