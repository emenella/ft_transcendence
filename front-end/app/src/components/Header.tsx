import React from 'react';
import './Header.css';
import logo from '../assets/black_logo.png';

function Header() {
  return (
    <div className='flex-container'>
      <div> <img src={logo} alt='Logo du site' /> </div>
      <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
      <div>
        <p>
          Connexion<br /> {/* ou Paramètres de compte */}
          Création d'un compte {/* ou Déconnexion */}
        </p>
      </div>
    </div>
  );
}

export default Header;
