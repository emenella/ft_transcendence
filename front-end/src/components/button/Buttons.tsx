import React from "react";
import Emoji from "../Emoji";
import { useNavigate } from "react-router-dom";
import { invite, accept, deny, remove, blacklist, unblacklist } from '../../utils/friends_blacklists_system';

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
        navigate("/2fa");
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

export function DuelButton() {
	return (
		<div>
			<label>Proposer une partie </label>
			<button onClick={() => { }}> <Emoji label="crossed_swords" symbol="⚔️" /> </button>
		</div>
	);
}

export function SpectateButton() {
	return (
		<div>
			<label>Proposer une partie </label>
			<button onClick={() => { }}> <Emoji label="tv" symbol="📺" /> </button>
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