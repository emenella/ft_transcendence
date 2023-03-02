import React from 'react';
import { connexion, firstConnexion } from '../api/Auth'
import redirection from '../utils/Redirection';

async function login() {
    const url = await connexion();
}

async function signUp() {
    const url = await firstConnexion();
    console.log(url);
    redirection(url);
}

function HeaderNotConnected() {
    return (
        <div>
            <button onClick={login}>Connexion</button>
            <br />
            <button onClick={signUp}>Création d'un compte</button>
        </div>
    );
}

export default HeaderNotConnected;
