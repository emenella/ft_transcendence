import React from 'react';

// catch error
function logOutApi() {
    fetch('/api/logout', { method: 'POST' })
}

function HeaderConnected() {
    return (
        <div>
            <button>Paramètres de compte</button>
            {/* onClick -> changer la main part -> changer de route /accountmanagement */}
            <br />
            <button onClick={logOutApi}>Déconnexion</button>
        </div>
    );
}

export default HeaderConnected;
