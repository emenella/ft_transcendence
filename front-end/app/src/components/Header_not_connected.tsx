import React from 'react';

// try catch
function connexionApi() {
    fetch('/api/login', { method: 'POST' })
        .then(data => data.json())
}

// try catch
function firstConnexionApi() {
    fetch('/api/users', { method: 'POST' })
        .then(data => data.json())
}

function HeaderNotConnected() {
    return (
        <div>
            <button onClick={connexionApi}>Connexion</button>
            <br />
            <button onClick={firstConnexionApi}>Création d'un compte</button>
        </div>
    );
}

export default HeaderNotConnected;
