import React from 'react';
import './Header.css';
import logo from '../assets/black_logo.png';

interface User {
  status: boolean;
}

function Header({status}: User) {
  if (status)
    return (
      <div className='flex-container'>
      <div> <img src={logo} alt='Logo du site' /> </div>
      <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
      <div>
        <p>
          Paramètres de compte<br />
          Déconnexion
        </p>
      </div>
    </div>
    );
  else
    return (
      <div className='flex-container'>
      <div> <img src={logo} alt='Logo du site' /> </div>
      <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
      <div>
        <p>
          Connexion<br />
          Création d'un compte
        </p>
      </div>
    </div>
    );
}

export default Header;
