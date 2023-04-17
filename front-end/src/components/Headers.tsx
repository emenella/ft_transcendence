import React from 'react';
import { Link } from "react-router-dom";
import SignUpButton from './button/SignUpButton';
import { User } from '../utils/backend_interface';
import { getMe } from '../api/User';

export function HeaderConnected(props : { logout: () => void, user: User }) {
    const linkStyle = {
        color: "white",
    }


    return (
        <div>
            <Link to={"/profil/" + props.user.id} style={linkStyle}>Profil</Link>
            <br />
            <Link to="/accountmanagement" style={linkStyle}>Paramètres de compte</Link>
            <br />
            <button onClick= {props.logout}>Déconnexion</button>
        </div>
    );
}

export function HeaderNotConnected(props : { url: string }) {
    return (
        <div>
            <SignUpButton url={props.url} />
        </div>
    );
}
