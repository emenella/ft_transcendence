import React from "react";
import { useNavigate } from 'react-router-dom'
import { getToken } from "../api/Api";
import PongGame from "../components/Game/PongGame";


export default function Spectate() {
    const navigate = useNavigate();
    const token = getToken();
    const spec = window.location.pathname.split("/")[2];
    console.log(spec);
    if (!token || !spec) {
        navigate("/error");
    }

    return (
        <PongGame width={800} height={600} token={token as string} isQueue={false} spec={spec} />
    );
}