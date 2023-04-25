import axios from "axios";
import Cookies from "universal-cookie";
import { Socket, io } from "socket.io-client"

const protocol = process.env.REACT_APP_API_PROTOCOL
const host = process.env.REACT_APP_API_HOST
const port = process.env.REACT_APP_API_PORT

export const loginUrl = process.env.REACT_APP_API_LOGIN_URL;

console.log(loginUrl)
;
export const url = `${protocol}://${host}:${port}`;

export const ws = `${protocol}://${host}:81`;

export const socket = io(ws, { extraHeaders: { Authorization: getJwtCookie() as string }});

export const client = axios.create({
	baseURL: `${protocol}://${host}:${port}`,
});

export function authHeader(type?: string) {
	let token = getJwtCookie();

	if (token) {
		let access_token = token;
		return {
			"Content-Type": type ? type : "application/json",
			"Authorization": "Bearer " + access_token
		};
	}
	return {
		"Content-Type": type ? type : "application/json",
		"Authorization": ""
	};
}

export function setJwtCookie(token: string) {
	const cookie = new Cookies();
	cookie.set("jwtToken", token, { path: "/", maxAge: 3600 });
	client.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export function getJwtCookie() {
	const cookie = new Cookies();
	return cookie.get("jwtToken");
}

export function removeJwtCookie() {
	const cookie = new Cookies();
	cookie.remove("jwtToken");
}
