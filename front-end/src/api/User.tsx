import { SockEvent, User } from "../utils/backendInterface";
import { client as axios, authHeader } from "./JwtCookie"
import  { AxiosError } from "axios";
import toast from "react-hot-toast";
import { toastError } from "../components/Error";
import { socket } from "./JwtCookie";

/*
server         | 2023-04-25T19:31:05.491618933Z [Nest] 73  - 04/25/2023, 7:31:05 PM   ERROR [ExceptionsHandler] update or delete on table "chan" violates foreign key constraint "FK_5fdbbcb32afcea663c2bea2954f" on table "message"
*/

export async function getMe(): Promise<User> {
	const res = await axios.get<User>("api/users/me", { headers: authHeader() });
	console.log(res.data);
	return res.data;
}

export async function changeUsername(username: string) {
	const req = await axios.post("api/users/me", { username: username }, { headers: authHeader() });
	toast.success("Pseudo enregistré.");
	return req;
}

export async function uploadAvatar(formData: FormData) {
	const req = await axios.post("api/users/avatar/upload", formData, { headers: authHeader("multipart/form-data") });
	toast.success("Image enregistrée.");
	return req;
}

export async function delete2FA() {
	const req = await axios.delete("api/auth/2fa/delete", { headers: authHeader() });
	toast.success("2FA désactivé.");
	return req;
}

export async function getUserById(id: number) {
	const res = await axios.get<User>("api/users/id/?id=" + id, { headers: authHeader() });
	return res.data;
}

export async function getUserByUsername(username: string) {
	const res = await axios.get("api/users/username/?username=" + username, { headers: authHeader() });
	return res.data;
}

export async function getMatchs(id: number) {
	const res = await axios.get("api/users/match_history/?id=" + id, { headers: authHeader() });
	return res.data;
}

// export async function inviteFriend(username : string) {
// 	try {
// 		return await axios.post("api/users/friends/invite", { username: username }, { headers: authHeader() });
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

export function inviteFriend(username : string) {
	
	socket.emit(SockEvent.SE_FR_INVITE, { username: username });
}

// export async function removeFriend(username : string) {
// 	try {
// 		return await axios.delete("api/users/friends/remove", { headers: authHeader(), data : { username: username } });
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

export function removeFriend(username : string) {
	socket.emit(SockEvent.SE_FR_REMOVE, { username: username });
}

// export async function acceptFriend(username : string) {
// 	try {
// 		return await axios.post("api/users/friends/accept", { username: username }, { headers: authHeader() });
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

export function acceptFriend(username : string) {
	socket.emit(SockEvent.SE_FR_ACCEPT, { username: username });
}

// export async function denyFriend(username : string) {
// 	try {
// 		return await axios.delete("api/users/friends/deny", { headers: authHeader(), data : { username: username } });
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

export function denyFriend(username : string) {
	socket.emit(SockEvent.SE_FR_DENY, { username: username });
}

// export async function addFromBlacklist(username : string) {
// 	try {
// 		return await axios.post("api/users/blacklist/add", { username: username }, { headers: authHeader() });
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

export function addFromBlacklist(username : string) {
	socket.emit(SockEvent.SE_BL_ADD, { username: username });
}

// export async function removeFromBlacklist(username : string) {
// 	try {
// 		return await axios.delete("api/users/blacklist/remove", { headers: authHeader(), data : { username: username } });
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

export function removeFromBlacklist(username : string) {
	socket.emit(SockEvent.SE_BL_REMOVE, { username: username });
}

// export async function changeColorPaddle(color: string) {
// 	try {
// 		const req = await axios.post("api/users/color", { color: color }, { headers: authHeader() });
// 		toast.success("Couleur changée.");
// 		return req;
// 	}
// 	catch (e) {
// 		toastError(e as AxiosError);
// 	}
// }

export function changeColorPaddle(color: string) {
	socket.emit(SockEvent.SE_COLOR, { color: color });
	toast.success("Couleur changée.");
}