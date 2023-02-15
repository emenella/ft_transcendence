import React from 'react';
import './Header.css';
import logo from '../assets/black_logo.png';

interface User {
    status: boolean;
}

function Header({ status }: User) {

    // dev
    // status = true;
    // end dev

    if (status)
        return (
            <div className='flex-container'>
                <div> <img src={logo} alt='Logo du site' /> </div>
                <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
                <div>
                    <p> Paramètres de compte </p>
                    {/* onClick -> changer la main part */}
                    <form action="/api/logout" method='post'>
                        <button>Déconnexion</button>
                    </form>
                </div>
            </div>
        );
    else
        return (
            <div className='flex-container'>
                <div> <img src={logo} alt='Logo du site' /> </div>
                <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
                <div>
                    <p>Connexion</p>
                    {/* onClick -> changer la main part */}
                    <p>Création d'un compte</p>
                    {/* onClick -> changer la main part */}
                </div>
            </div>
        );
}

export default Header;
