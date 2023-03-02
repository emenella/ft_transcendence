import React from 'react';
import { logOutApi } from '../api/Auth';
import redirection from '../utils/Redirection';

function HeaderConnected() {
    return (
        <div>
            <button onClick={() => redirection('/accountmanagement')}>Paramètres de compte</button>
            <br />
            <button onClick={logOutApi}>Déconnexion</button>
        </div>
    );
}

export default HeaderConnected;
