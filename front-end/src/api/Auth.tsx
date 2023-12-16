import Cookies from "universal-cookie";
import axios from "axios";
import io from "socket.io-client";

const protocol = process.env.REACT_APP_API_PROTOCOL
const host = process.env.REACT_APP_API_HOST
const port = process.env.REACT_APP_API_PORT

export const url = `${protocol}://${host}:${port}`;
export const url42 = process.env.REACT_APP_API_URL_42
const ws = `wss://${host}:${port}`;

export const socket = io(ws, { extraHeaders: { authorization: getJwtCookie() }, autoConnect: false })

export const client = axios.create({
	baseURL: url,
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

const changeTokenSocket = (token: string) => {
	socket.io.opts.extraHeaders = { authorization: token };
}

export function setJwtCookie(token: string) {
	const cookie = new Cookies();
	cookie.set("jwtToken", token, { path: "/", maxAge: 3600, sameSite: "strict", secure: true});
	client.defaults.headers.common["Authorization"] = "Bearer " + token;
	changeTokenSocket(token);
}

export function getJwtCookie() {
	const cookie = new Cookies();
	return cookie.get("jwtToken");
}

export function removeJwtCookie() {
	const cookie = new Cookies();
	cookie.remove("jwtToken", { path: "/", sameSite: "strict", secure: true });
	changeTokenSocket("");
}