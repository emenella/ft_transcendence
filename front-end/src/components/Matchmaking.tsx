import React from 'react';
import './Matchmaking.css';
import logo_matchmaking from '../assets/logo_pong.jpg';

{/* Onglet "Jouer" */ }
class Matchmaking extends React.Component {
	render() {
		return (
			<div className='matchmaking'>
				<h2>JOUER</h2>
				<div className='matchmaking_mode'>
					<img src={logo_matchmaking} alt="Logo du matchmaking aléatoire" />
					<p>Matchmaking aléatoire</p>
				</div>
				<br />
				<div className='matchmaking_mode'>
					<img src={logo_matchmaking} alt="Logo de la map 1" />
					<p>Map 1</p>
				</div>
				<br />
				<div className='matchmaking_mode'>
					<img src={logo_matchmaking} alt="Logo de la map 2" />
					<p>Map 2</p>
				</div>
				<br />
				<div className='matchmaking_mode'>
					<img src={logo_matchmaking} alt="Logo de la map 3" />
					<p>Map 3</p>
				</div>
			</div>
		);
	}
}

export default Matchmaking;
