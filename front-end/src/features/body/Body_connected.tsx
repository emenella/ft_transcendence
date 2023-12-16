import React, { useEffect, useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { toast } from "react-hot-toast";
import "./Body_connected.css";
import UserSidebar from "../profile/UserSidebar";
import Chat from "../chat/Chat";
import Emoji from "../../components/Emoji";
import { SocketContext } from "../../utils/SocketContext";
import { SockEvent, User } from "../../utils/backendInterface";

function duelRequestToast(socket: Socket, sender: User) {
	toast((t) => (
		<span>
		<p>{sender.username} t'a invité à jouer !</p>
		<button onClick={() => { socket?.emit(SockEvent.SE_GM_DUEL_ACCEPT, sender); toast.dismiss(t.id); }}>
			Accepter <Emoji label="check_mark" symbol="✔️" />
		</button>
		<button onClick={() => { socket?.emit(SockEvent.SE_GM_DUEL_DENY, sender); toast.dismiss(t.id); }}>
			Refuser <Emoji label="cross_mark" symbol="❌" />
		</button>
	</span>), {
		duration: 30000,
	})
}

function duelRequestHandler(socket: Socket, navigate: NavigateFunction) {
	function duelRequestReceivedListener(sender: User)	{ duelRequestToast(socket, sender); }
	function duelRequestSuccess()						{ toast.success("Demande de duel envoyée."); }
	function duelRequestFailure(error: string)			{ toast.error(error); }
	function duelDeny()									{ toast.error("Demande de duel refusée."); }
	function duelLaunched()								{ navigate("/home"); }
	
	socket?.on(SockEvent.SE_GM_DUEL_RECEIVE, duelRequestReceivedListener);
	socket?.on(SockEvent.SE_GM_DUEL_SUCCESS, duelRequestSuccess);
	socket?.on(SockEvent.SE_GM_DUEL_FAILURE, duelRequestFailure);
	socket?.on(SockEvent.SE_GM_DUEL_DENIED, duelDeny);
	socket?.on(SockEvent.SE_GM_DUEL_LAUNCH, duelLaunched);
	return () => {
		socket?.off(SockEvent.SE_GM_DUEL_RECEIVE, duelRequestReceivedListener);
		socket?.off(SockEvent.SE_GM_DUEL_SUCCESS, duelRequestSuccess);
		socket?.off(SockEvent.SE_GM_DUEL_FAILURE, duelRequestFailure);
		socket?.off(SockEvent.SE_GM_DUEL_DENIED, duelDeny);
		socket?.off(SockEvent.SE_GM_DUEL_LAUNCH, duelLaunched);
	}
}

function BodyConnected() {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
		
	useEffect(() => {
		socket?.connect();
		return () => { socket?.disconnect(); }
	}, [socket]);
	
	useEffect(() => duelRequestHandler(socket, navigate), [socket, navigate]);
	
	return (
		<div className="connected">
			<SocketContext.Provider value={socket}>
				<Chat />
				<UserSidebar />
			</SocketContext.Provider>
		</div>
	);
}

export default BodyConnected;
