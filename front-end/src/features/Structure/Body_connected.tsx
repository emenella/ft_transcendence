import React, { useState, useEffect, useContext } from "react";
import "./Body_connected.css";
import UserSidebar from "../Profile/UserSidebar";
import Chat from "../Chat/Chat";
import io, { Socket } from "socket.io-client"
import { url } from "../../api/JwtCookie";
import { getJwtCookie } from "../../api/JwtCookie";
import { SocketContext } from "../../utils/SocketContext";
import { UserContext } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import { acceptDuel, denyDuel } from "../../api/User";
import Emoji from "../../components/Emoji";
import { toast } from "react-hot-toast";


function BodyConnected() {
	// const userContext = useContext(UserContext);
	// const user = userContext?.user;
	const [socket, setSocket] = useState<Socket>();
	const navigate = useNavigate();

	useEffect(() => {
		const newSocket = io(url + "/user", { extraHeaders: { Authorization: getJwtCookie() as string } });
		setSocket(newSocket);
	}, [])

	async function duelRequestReceivedListener(sender: any) {
		async function accept(id : number) {
			const req = await acceptDuel(id);
			if (req?.status === 200) {
				toast.success("Invitation acceptée.");
				navigate("/home");
			} else
				toast.error("Erreur. Veuillez réessayer.");
		}
	
		async function deny(id : number) {
			const req = await denyDuel(id);
			if (req?.status === 200) {
				toast.success("Invitation refusée.");
			} else
				toast.error("Erreur. Veuillez réessayer.");
		}
	
		toast((t) => (
			<span>
				<p>{sender.username} t"a invité à jouer !</p>
				<button onClick={() => { accept(sender.id); toast.dismiss(t.id); }}>
					Accepter <Emoji label="check_mark" symbol="✔️" />
				</button>
				<button onClick={() => { deny(sender.id); toast.dismiss(t.id); }}>
					Refuser <Emoji label="cross_mark" symbol="❌" />
				</button>
			</span>), {
			duration: 30000,
		});
	}

	useEffect(() => {
		socket?.on("duelRequestReceived", duelRequestReceivedListener);
		return () => {
			socket?.off("duelRequestReceived", duelRequestReceivedListener);
		}
	}, [socket])

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
