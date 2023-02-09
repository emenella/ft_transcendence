import React from 'react';
import './User_not_connected.css';
import logo from '../assets/white_logo.png';

function NotConnected() {
    return (
        <div>
            {/* Accueil */}
            <div className='welcome'>
                <h2>Bienvenue sur votre site préféré de pong codé par vos plus dévoués développeurs.</h2>
                <img src={logo} alt='Logo du site' />
                <h4>Venez vous mesurer aux meilleurs joueurs de tout Lyon !</h4>
                <p>Pour ça rien de plus simple : créez-vous un compte ou connectez-vous, puis lancez votre partie.</p>
                <h4>Comment jouer ?</h4>
                <p>Rien de compliqué, il vous suffit de jouer avec les flèches directionnelles de votre clavier.</p>
                <h4>Amusez-vous bien !</h4>
            </div>

            <br />
            <br />
            <br />
            <br />

            {/* Onglet de connexion */}
            <div className='connexion'>
                <form action="" method="get">
                    <label>Adresse mail : </label> <input type="email" /> <br />
                    <label>Mot de passe : </label> <input type="text" />
                </form>
            </div>

            <br />
            <br />
            <br />
            <br />

            {/* Onglet d'inscription */}
            <div className='registration'>
                <form action="" method="post">
                    <label>Adresse mail : </label> <input type="email" /> <br />
                    <label>Pseudo : </label> <input type="text" /> <br />
                    <label>Photo de profil : </label> <input type="file" accept='.PNG,.JPG' /> <br />
                    <label>Mot de passe : </label> <input type="text" /> <br />
                    <label>Vérification du mot de passe : </label> <input type="text" />
                </form>
            </div>
        </div>
    );
}

export default NotConnected;
