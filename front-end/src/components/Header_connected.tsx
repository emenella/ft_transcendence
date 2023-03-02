import React from 'react';
import { logOutApi } from '../api/Auth';

function HeaderConnected() {
    return (
        <div>
            <button>Paramètres de compte</button>
            {/* onClick -> changer la main part -> Redirect /accountmanagement */}
            <br />
            <button onClick={logOutApi}>Déconnexion</button>
        </div>
    );
}

export default HeaderConnected;
