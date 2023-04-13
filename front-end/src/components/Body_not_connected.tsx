import React from 'react';
import './Body_not_connected.css';
import logo from '../assets/white_logo.png';
import emenella from '../assets/emenella.jpg';
import ebellon from '../assets/ebellon.jpg';
import pthomas from '../assets/pthomas.jpg';
import mberne from '../assets/mberne.jpg';

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
                    <img src={emenella} alt="Photo d'Erwan" className='profilPhotoErwan' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id sem orci.
                        Sed congue, odio sed fringilla dictum, nunc quam blandit tellus, quis semper justo nisi non ligula.
                        Curabitur sed nunc sit amet dolor efficitur viverra nec sed lectus.</p>
                </div>
                <div>
                    <h4>Emil Bellon</h4>
                    <img src={ebellon} alt="Photo d'Emil" className='profilPhoto' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id sem orci.
                        Sed congue, odio sed fringilla dictum, nunc quam blandit tellus, quis semper justo nisi non ligula.
                        Curabitur sed nunc sit amet dolor efficitur viverra nec sed lectus.</p>
                </div>
                <div>
                    <h4>Pierre Thomas</h4>
                    <img src={pthomas} alt="Photo de Pierre" className='profilPhoto' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id sem orci.
                        Sed congue, odio sed fringilla dictum, nunc quam blandit tellus, quis semper justo nisi non ligula.
                        Curabitur sed nunc sit amet dolor efficitur viverra nec sed lectus.</p>
                </div>
                <div>
                    <h4>Manon Berne</h4>
                    <img src={mberne} alt="Photo de Manon" className='profilPhoto' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id sem orci.
                        Sed congue, odio sed fringilla dictum, nunc quam blandit tellus, quis semper justo nisi non ligula.
                        Curabitur sed nunc sit amet dolor efficitur viverra nec sed lectus.</p>
                </div>
            </div>
		</div>
	);
}

export default BodyNotConnected;
