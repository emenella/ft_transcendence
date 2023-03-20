import React from 'react';
import { Link } from 'react-router-dom';
import './Profil.css';
import { getMe } from '../api/User';

{/* Onglet "Profil" */ }
// Besoin de fix l'arrangement photo et pseudo
function Profil() {
	const [user, setUser] = React.useState<any>();
	React.useEffect(() => {
		const getUser = async () => {
			const tmp = await getMe();
			setUser(JSON.parse(tmp));
		};
		getUser();
	}, []);

	const [avatar, setAvatar] = React.useState<any>();
	React.useEffect(() => {
		const getAvatar = async () => {
			const tmp = await getMe();
			setAvatar(JSON.parse(tmp));
		};
		getAvatar();
	}, []);

	const [matchs, setMatchs] = React.useState<any>();
	React.useEffect(() => {
		const getMatchs = async () => {
			const tmp = await getMe();
			setMatchs(JSON.parse(tmp));
		};
		getMatchs();
	}, []);

	const winrate = (user.wins / user.matchs) * 100;

	const listMatchs = matchs.map((match : any) => {
		if (match.winner.username === user.username) {
			<div className="winner">
				<tr>
					<td>{match.winner.username} VS {match.looser.username}</td>
					<td>{match.scores[0]} - {match.scores[1]}</td>
				</tr>
			</div>
		}
		else {
			<div className="looser">
				<tr>
					<td>{match.looser.username} VS {match.winner.username}</td>
					<td>{match.scores[1]} - {match.scores[0]}</td>
				</tr>
			</div>
		}
	}
	);

	return (
		<div className='profil'>
			<Link to={"/"}>&#60;- Retour au matchmaking</Link>
			<h2>PROFIL</h2>
			<div className='player-profil'>
				<img src={avatar.path} alt="Logo du joueur" />
				<p>{user.username}</p>
			</div>
			<div className='player-info'>
				<div className='statistics'>
					<h2>Statistiques du joueur</h2>
					<p>Nombre de games : {user.matchs}</p>
					<p>Win rate : {winrate}%</p>
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
						<tbody>{listMatchs}</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Profil;
