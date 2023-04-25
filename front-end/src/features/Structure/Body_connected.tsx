import React, { useState, useEffect } from "react";
import "./Body_connected.css";
import UserSidebar from "../Profile/UserSidebar";
import Chat from "../Chat/Chat";
import io, { Socket } from "socket.io-client"
import { url } from "../../api/JwtCookie";
import { getJwtCookie } from "../../api/JwtCookie";
import { SocketContext } from "../../utils/SocketContext";
import { useNavigate } from "react-router-dom";
import Emoji from "../../components/Emoji";
import { toast } from "react-hot-toast";
import { User } from "../../utils/backendInterface";
import { socket } from "../../api/JwtCookie";


function BodyConnected() {
	const socketUser = socket;
	const navigate = useNavigate();
    
    useEffect(() => {
        function duelLaunched() {
            navigate("/home");
        }
                
        async function duelRequestReceivedListener(sender: User) {

            function accept(id : number) {
                socket?.emit("duelRequestAccepted", { senderId: sender.id });
            }
            // function deny(id : number) {
            //     socket?.emit("duelRequestDenied", sender);
            // }
            
            toast((t) => (
                <span>
                    <p>{sender.username} t'a invité à jouer !</p>
                    <button onClick={() => { accept(sender.id); toast.dismiss(t.id); }}>
                        Accepter <Emoji label="check_mark" symbol="✔️" />
                    </button>
                    <button onClick={() => { /*deny(sender.id);*/ toast.dismiss(t.id); }}>
                        Refuser <Emoji label="cross_mark" symbol="❌" />
                    </button>
                </span>), {
                duration: 30000,
            });
        }
        
        socket?.on("duelLaunched", duelLaunched);
        socket?.on("duelRequestReceived", duelRequestReceivedListener);
        return () => {
            socket?.off("duelLaunched", duelLaunched);
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
