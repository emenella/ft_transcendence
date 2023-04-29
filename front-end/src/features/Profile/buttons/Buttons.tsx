import React from "react";
import { useNavigate } from "react-router-dom";
import Emoji from "../../../components/Emoji";
import { invite, accept, deny, remove, blacklist, unblacklist } from "../../../utils/friends_blacklists_system";
import { Socket } from "socket.io-client";

export	function Disable2FA({ onClick }: { onClick: () => void }) {
    return (
        <div>
            <button onClick={onClick}>Désactivation 2FA <Emoji label="cross_mark" symbol="❌" /></button>
        </div>
    );
}

export	function Enable2FA() {
    const navigate = useNavigate();

    function move() {
        navigate("/home/2fa");
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
			<button onClick={ () => { invite(username!); } }> <Emoji label="handshake" symbol="🤝" /> </button>
		</div>
	);
}

export function RemoveFriendButton({ username }: { username: string | undefined }) {
	return (
        <div>
			<label>Retirer des amis </label>
			<button onClick={ () => { remove(username!); } }> <Emoji label="no_entry_sign" symbol="🚫" /> </button>
		</div>
	);
}

export function DuelButton({ socket, receiverId }: { socket: Socket | undefined, receiverId: number }) {
	return (
		<div>
			<label>Proposer une partie </label>
			<button onClick={ () => { socket?.emit("duelRequestSent", { receiverId: receiverId } ); } }> <Emoji label="crossed_swords" symbol="⚔️" /> </button>
		</div>
	);
}

export function BlacklistButton({ username }: { username: string | undefined }) {
	return (
		<div>
			<label>Bloquer le joueur </label>
			<button onClick={ () => { blacklist(username!); } }> <Emoji label="no_entry_sign" symbol="🚫" /> </button>
		</div>
	);
}

export function UnblacklistButton({ username }: { username: string | undefined }) {
	return (
		<div>
			<label>Débloquer le joueur </label>
			<button onClick={ () => { unblacklist(username!); } }> <Emoji label="handshake" symbol="🤝" /> </button>
		</div>
	);
}

export function AcceptAndDenyFriendButtons({ username }: { username: string | undefined}) {
	return (
		<div>
			<button onClick={() => accept(username!)}>Accepter <Emoji label="check_mark" symbol="✔️" /></button>
			<button onClick={() => deny(username!)}>Refuser <Emoji label="cross_mark" symbol="❌" /></button>
		</div>
	);
}
