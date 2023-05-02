import React, { useEffect } from "react";
import "./Body_connected.css";
import UserSidebar from "../Profile/UserSidebar";
import Chat from "../Chat/Chat";
import { SocketContext } from "../../utils/SocketContext";
import { useNavigate } from "react-router-dom";
import Emoji from "../../components/Emoji";
import { toast } from "react-hot-toast";
import { SockEvent, User } from "../../utils/backendInterface";
import { Route, Routes, Navigate } from "react-router-dom";
import Matchmaking from "../Game/Matchmaking";
import Profile from "../Profile/Profile";
import AccountManagement from "../Profile/AccountManagement";
import SignUp from "../../auth/SignUp";
import { Enable2FA } from "../../auth/2FA";

function BodyConnected() {
	const navigate = useNavigate();
    const socket = React.useContext(SocketContext);
    
    useEffect(() => {
        function duelLaunched() {
            navigate("/home");
        }
                
        async function duelRequestReceivedListener(sender: User) {
            toast((t) => (
                <span>
                    <p>{sender.username} t'a invité à jouer !</p>
                    <button onClick={() => { socket?.emit(SockEvent.SE_GM_DUEL_ACCEPT, { senderId: sender.id }); toast.dismiss(t.id); }}>
                        Accepter <Emoji label="check_mark" symbol="✔️" />
                    </button>
                    <button onClick={() => { socket?.emit(SockEvent.SE_GM_DUEL_DENY, sender); toast.dismiss(t.id); }}>
                        Refuser <Emoji label="cross_mark" symbol="❌" />
                    </button>
                </span>), {
                duration: 30000,
            });
        }
        socket?.connect();
        socket?.on(SockEvent.SE_GM_DUEL_LAUNCH, duelLaunched);
        socket?.on(SockEvent.SE_GM_DUEL_RECEIVE, duelRequestReceivedListener);
        return () => {
            socket?.off(SockEvent.SE_GM_DUEL_LAUNCH, duelLaunched);
            socket?.off(SockEvent.SE_GM_DUEL_RECEIVE, duelRequestReceivedListener);
            socket?.disconnect();
        }
    }, [])

	return (
		<div className="connected">
			<SocketContext.Provider value={socket}>
			<Chat />
            <div>
                <Routes>
                    <Route index element={<Matchmaking/>}></Route>
                    <Route path="profile/:id" element={<Profile />} />
                    <Route path="accountmanagement" element={<AccountManagement />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="2fa" element={<Enable2FA/>} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
			</div>
			<UserSidebar />
			</SocketContext.Provider>
		</div>
	);
}

export default BodyConnected;
