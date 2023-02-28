import React from 'react';

function HeaderConnected() {
    return (
        <div>
            <button>Paramètres de compte</button>
            {/* onClick -> changer la main part */}
            <br />
            <form action="/api/logout" method='post'>
                <button>Déconnexion</button>
            </form>
        </div>
    );
}

export default HeaderConnected;
