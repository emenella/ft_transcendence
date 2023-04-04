import React from 'react';
import './Body_not_connected.css';
import logo from '../assets/white_logo.png';

function BodyNotConnected() {
	return (
		<div className='notconnected'>
			<h2>
				Bienvenue sur votre site préféré de pong codé par vos plus dévoués
				développeurs.
			</h2>
			<img src={logo} alt="Logo du site" />
			<h4>Venez vous mesurer aux meilleurs joueurs de tout Lyon !</h4>
			<p>
				Pour ça rien de plus simple : créez-vous un compte ou connectez-vous,
				puis lancez votre partie.
			</p>
			<h4>Comment jouer ?</h4>
			<p>
				Rien de compliqué, il vous suffit de jouer avec les flèches
				directionnelles de votre clavier.
			</p>
			<h4>Amusez-vous bien !</h4>
		</div>
	);
}

export default BodyNotConnected;
