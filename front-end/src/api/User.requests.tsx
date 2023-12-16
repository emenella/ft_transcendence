import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { toastError } from "../components/toastError";
import { User } from "../utils/backendInterface";
import { client as axios, authHeader } from "./Auth"

export async function getMe(): Promise<User | undefined> {
	try {
		const res = await axios.get<User>("api/users/me", { headers: authHeader() });
		return res.data;
	}
	catch (e) {
		toastError(e as AxiosError);
		return undefined;
	}
}

export async function changeUsername(username: string) {
	try {
		const req = await axios.post("api/users/me", { username: username }, { headers: authHeader() });
		toast.success("Pseudo mis à jour.");
		return req;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function uploadAvatar(formData: FormData) {
	try {
		const req = await axios.post("api/users/avatar/upload", formData, { headers: authHeader("multipart/form-data") });
		toast.success("Avatar mis à jour.");
		return req;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function delete2FA(code: string) {
	try {
		const req = await axios.delete("api/auth/2fa/delete", { headers: authHeader(), data: { code: code } });
		toast.success("2FA désactivé.");
		return req.data.access_token;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function getUserById(id: number) {
	try {
		const res = await axios.get<User>("api/users/id/?id=" + id, { headers: authHeader() });
		return res.data;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function getUserByUsername(username: string) {
	try {
		const res = await axios.get("api/users/username/?username=" + username, { headers: authHeader() });
		return res.data;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function getMatchs(id: number) {
	try {
		const res = await axios.get("api/users/match_history/?id=" + id, { headers: authHeader() });
		return res.data;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function inviteFriend(username: string) {
	try {
		const req = await axios.post("api/users/friends/invite", { username: username }, { headers: authHeader() });
		toast.success("Invitation envoyée.");
		return (req);
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function removeFriend(username: string) {
	try {
		const req = await axios.delete("api/users/friends/remove", { headers: authHeader(), data: { username: username } });
		toast.success("Ami supprimé.");
		return (req);
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function acceptFriend(username: string) {
	try {
		const req = await axios.post("api/users/friends/accept", { username: username }, { headers: authHeader() });
		toast.success("Demande d'ami acceptée.");
		return (req);
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function denyFriend(username: string) {
	try {
		const req = await axios.delete("api/users/friends/deny", { headers: authHeader(), data: { username: username } });
		toast.success("Demande d'ami refusée.");
		return (req);
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function addFromBlacklist(username: string) {
	try {
		const req = await axios.post("api/users/blacklist/add", { username: username }, { headers: authHeader() });
		toast.success("Utilisateur bloqué.");
		return (req);
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function removeFromBlacklist(username: string) {
	try {
		const req = await axios.delete("api/users/blacklist/remove", { headers: authHeader(), data: { username: username } });
		toast.success("Utilisateur débloqué.");
		return (req);
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}

export async function changeColorPaddle(color: string) {
	try {
		const req = await axios.post("api/users/color", { color: color }, { headers: authHeader() });
		toast.success("Couleur mise à jour.");
		return req;
	}
	catch (e) {
		toastError(e as AxiosError);
	}
}
