import React from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import Emoji from "../../../components/Emoji";
import { SockEvent } from "../../../utils/backendInterface";
import { acceptFriend, addFromBlacklist, denyFriend, inviteFriend, removeFriend, removeFromBlacklist } from "../../../api/User.requests";

export function Disable2FA({ onClick }: { onClick: () => void }) {
	return (
		<div>
			<button onClick={onClick}>Désactivation 2FA <Emoji label="cross_mark" symbol="❌" /></button>
		</div>
	);
}

export function Enable2FA() {
	const navigate = useNavigate();

	function move() {
		navigate("/enable2fa");
	}

	return (
		<div>
			<button onClick={move}>Activation 2FA <Emoji label="check_mark" symbol="✔️" /></button>
		</div>
	);
}

export function AddFriendButton({ username }: { username: string | undefined }) {
	return (
		<div>
			<label>Ajouter en ami </label>
			<button onClick={() => { inviteFriend(username!); }}> <Emoji label="handshake" symbol="🤝" /> </button>
		</div>
	);
}

export function AcceptAndDenyFriendButtons({ username }: { username: string | undefined }) {
	return (
		<div>
			<button onClick={() => acceptFriend(username!)}>Accepter <Emoji label="check_mark" symbol="✔️" /></button>
			<button onClick={() => denyFriend(username!)}>Refuser <Emoji label="cross_mark" symbol="❌" /></button>
		</div>
	);
}


export function RemoveFriendButton({ username }: { username: string | undefined }) {
	return (
		<div>
			<label>Retirer des amis </label>
			<button onClick={() => { removeFriend(username!); }}> <Emoji label="no_entry_sign" symbol="🚫" /> </button>
		</div>
	);
}

export function DuelButton({ socket, receiverId }: { socket: Socket | undefined, receiverId: number | undefined }) {
	return (
		<div>
			<label>Proposer une partie </label>
			<button onClick={() => { socket?.emit(SockEvent.SE_GM_DUEL_SEND, { receiverId: receiverId }); }}> <Emoji label="crossed_swords" symbol="⚔️" /> </button>
		</div>
	);
}

export function BlacklistButton({ username }: { username: string | undefined }) {
	return (
		<div>
			<label>Bloquer le joueur </label>
			<button onClick={() => { addFromBlacklist(username!); }}> <Emoji label="no_entry_sign" symbol="🚫" /> </button>
		</div>
	);
}

export function UnblacklistButton({ username }: { username: string | undefined }) {
	return (
		<div>
			<label>Débloquer le joueur </label>
			<button onClick={() => { removeFromBlacklist(username!); }}> <Emoji label="handshake" symbol="🤝" /> </button>
		</div>
	);
}
