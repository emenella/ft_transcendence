import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css';
import PongGame from "../features/Game/PongGame";
import { getToken } from "../api/Api";
import { Link } from 'react-router-dom';
import Emoji from '../components/Emoji';

export default function Spectate() {
    const navigate = useNavigate();
    const token = getToken();
    const spec = useParams().id;

    if (!token || !spec) {
        navigate("/error");
    }

    const linkStyle = {
		color: "black",
		textDecoration: "none",
		fontSize: "1.4rem"
	}

	return (
        <div>
            <Link to={"/"} style={linkStyle}><Emoji label="arrow_left" symbol="⬅️" />Retour au matchmaking</Link>
            <PongGame height={600} width={800} spec={spec} isQueue={false} handlefound={() => {}} />
        </div>
		);
}
