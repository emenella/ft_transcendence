import React from 'react';

async function connexionApi() :Promise<string> {
    const req = await fetch('/auth/2fa/login', { method: 'POST' });
    const data = await req.json();
    return data as string;
}

// catch error
function firstConnexionApi() {
    fetch('/auth', { method: 'POST' })
        .then(data => data.json())
}

async function HeaderNotConnected() {
    const url = await connexionApi();
    return (
        <div>
            <button onClick={connexionApi}>Connexion</button>
            <br />
            <button onClick={firstConnexionApi}>Création d'un compte</button>
        </div>
    );
}

export default HeaderNotConnected;
