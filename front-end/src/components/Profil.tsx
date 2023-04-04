import React from 'react';
import { Link } from 'react-router-dom';
import './Profil.css';
import { getMatchs } from '../api/User';
import Emoji from './Emoji';

function Profil(user: any) {
	// const avatar = user.avatar.path;

	// const [matchs, setMatchs] = React.useState<any>();
	// React.useEffect(() => {
	// 	const getUserMatchs = async () => {
	// 		const tmp = await getMatchs(user.id);
	// 		setMatchs(JSON.parse(tmp));
	// 	};
	// 	getUserMatchs();
	// }, []);

	// const winrate = (user.wins / user.matchs) * 100;

	// const listMatchs = matchs.map((match: any) => {
	// 	if (match.winner.username === user.username) {
	// 		<div className="winner">
	// 			<tr>
	// 				<td>{match.winner.username} VS {match.loser.username}</td>
	// 				<td>{match.scores[0]} - {match.scores[1]}</td>
	// 			</tr>
	// 		</div>
	// 	}
	// 	else {
	// 		<div className="loser">
	// 			<tr>
	// 				<td>{match.loser.username} VS {match.winner.username}</td>
	// 				<td>{match.scores[1]} - {match.scores[0]}</td>
	// 			</tr>
	// 		</div>
	// 	}
	// }
	// );

	const linkStyle = {
		color: "black",
		textDecoration: "none"
	}

	return (
		<div className='profil'>
			<Link to={"/"} style={linkStyle}><Emoji label="arrow_left" symbol="⬅️" />Retour au matchmaking</Link>
			<h2>PROFIL</h2>
			<div className='player-profil'>
				{/* <img src={avatar.path} alt="Logo du joueur" /> */}
				<p>{user.username}</p>
			</div>
			<div className='player-info'>
				<div className='statistics'>
					<h2>Statistiques du joueur</h2>
					{/* <p>Nombre de games : {user.matchs}</p>
					<p>Win rate : {winrate}%</p> */}
				</div>
				<div className='history'>
					<h2>Historique des parties</h2>
					<table>
						<thead>
							<tr>
								<th scope='row'>Versus</th>
								<th scope='row'>Résultat</th>
							</tr>
						</thead>
						{/* <tbody>{listMatchs}</tbody> */}
					</table>
				</div>
			</div>
		</div>
	);
}

export default Profil;
