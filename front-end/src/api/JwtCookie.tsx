import axios from "axios";
import Cookies from "universal-cookie";
import { Socket, io } from "socket.io-client"

const protocol = import.meta.env.VITE_API_PROTOCOL
const host = import.meta.env.VITE_API_HOST
const port = import.meta.env.VITE_API_PORT

export const loginUrl = import.meta.env.VITE_API_LOGIN_URL;

console.log(loginUrl)
;
export const url = `${protocol}://${host}:${port}`;

export const ws = `ws://${host}:8100`;

export const socket = io(ws, { extraHeaders: { authorization: getJwtCookie() }, autoConnect: false });

export const changeTokenSocket = (token: string) => {
	socket.io.opts.extraHeaders = { Authorization: token };
}

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
	changeTokenSocket(token);
}

export function getJwtCookie(): string {
	const cookie = new Cookies();
	let ret = cookie.get("jwtToken");
	if (ret === undefined) {
		return "";
	}
	return ret;
}

export function removeJwtCookie() {
	const cookie = new Cookies();
	cookie.remove("jwtToken");
}
