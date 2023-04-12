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
			<h4>Venez vous mesurer aux meilleurs joueurs de tout 42Lyon !</h4>
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

			<h2>Vos dévoués développeurs.</h2>
            <div className='flexbox'>
                <div>
                    <h4>Erwan Menella</h4>
                    <img src={emenella} alt="Photo d'Erwan" />
                    <p>Description ?</p>
                </div>
                <div>
                    <h4>Emil Bellon</h4>
                    <img src={ebellon} alt="Photo d'Emil" />
                    <p>Description ?</p>
                </div>
                <div>
                    <h4>Pierre Thomas</h4>
                    <img src={pthomas} alt="Photo de Pierre" />
                    <p>Description ?</p>
                </div>
                <div>
                    <h4>Manon Berne</h4>
                    <img src={mberne} alt="Photo de Manon" />
                    <p>Description ?</p>
                </div>
            </div>
		</div>
	);
}

export default BodyNotConnected;
