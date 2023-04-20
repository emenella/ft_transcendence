import React from 'react';
import './Body_not_connected.css';
import logo from '../../assets/white_logo.png';
import emenella from '../../assets/emenella.jpg';
import ebellon from '../../assets/ebellon.jpg';
import pthomas from '../../assets/pthomas.jpg';
import mberne from '../../assets/mberne.jpg';

function BodyNotConnected() {
	return (
		<div className='notconnected'>
			<h2>
				Bienvenue sur le pong codé par vos plus dévoués développeurs.
			</h2>
			<img src={logo} alt="Logo du site" />
			<h4>Venez vous mesurer aux meilleurs joueurs de tout 42Lyon !</h4>
			<p>
				Pour ça rien de plus simple : créez-vous un compte ou connectez-vous,
				puis lancez votre partie.
			</p>
			<h4>Comment jouer ?</h4>
			<p>
				Rien de compliqué, il vous suffit de jouer avec les flèches
				directionnelles haut et bas de votre clavier.
			</p>
			<h4>Amusez-vous bien !</h4>
            <br />
			<h2>Vos dévoués développeurs.</h2>
            <div className='flexbox'>
                <div>
                    <h4>Erwan Menella</h4>
                    <img src={emenella} alt="Erwan" className='profilPhoto' />
                    <p><strong>One man army</strong>.</p>
                </div>
                <div>
                    <h4>Emil Bellon</h4>
                    <img src={ebellon} alt="Emil" className='profilPhoto' />
                    <p><strong>RPL_WHOISUSER</strong> ebellon.</p>
                </div>
                <div>
                    <h4>Pierre Thomas</h4>
                    <img src={pthomas} alt="Pierre" className='profilPhoto' />
                    <p>Spécialiste des <strong>caissons métalliques parallélépipédiques</strong>.</p>
                </div>
                <div>
                    <h4>Manon Berne</h4>
                    <img src={mberne} alt="Manon" className='profilPhoto' />
                    <p>Spécialiste du &#60;strong&#62;frontend&#60;/strong&#62;.</p>
                </div>
            </div>
		</div>
	);
}

export default BodyNotConnected;
