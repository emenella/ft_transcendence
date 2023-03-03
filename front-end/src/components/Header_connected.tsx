import React from 'react';
import { Link } from "react-router-dom";
import { logOutApi } from '../api/Auth';

function HeaderConnected() {
    return (
        <div>
            <Link to="/accountmanagement">Paramètres de compte</Link>
            <br />
            <button onClick={logOutApi}>Déconnexion</button>
        </div>
    );
}

export default HeaderConnected;
