import React from 'react';
import { Link } from 'react-router-dom';
import './Profil.css';
import { getMatchs, getUserById } from '../api/User';
import Emoji from './Emoji';

function Profil(props: { id: number }) {
	const [user, setUser] = React.useState<any>();

	React.useEffect(() => {
		const getUser = async () => {
			setUser(await getUserById(props.id));
		};
		getUser();
	}, [props.id]);

	const [matchs, setMatchs] = React.useState<any>();
	React.useEffect(() => {
		const getUserMatchs = async () => {
			const tmp = await getMatchs(props.id);
			setMatchs(JSON.parse(tmp));
		};
		getUserMatchs();
	}, [props.id]);

	// const winrate = (user.wins / user.matchs) * 100;

	const listMatchs = matchs?.map((match: any) => {
		if (match.winner.username === user.username) {
			<div className="winner">
				<tr>
					<td>{match.winner.username} VS {match.loser.username}</td>
					<td>{match.scores[0]} - {match.scores[1]}</td>
				</tr>
			</div>
		}
		else {
			<div className="loser">
				<tr>
					<td>{match.loser.username} VS {match.winner.username}</td>
					<td>{match.scores[1]} - {match.scores[0]}</td>
				</tr>
			</div>
		}
	}
	);

	const linkStyle = {
		color: "black",
		textDecoration: "none"
	}

	return (
		<div>
			<Link to={"/"} style={linkStyle}><Emoji label="arrow_left" symbol="⬅️" />Retour au matchmaking</Link>
			<div className='profil'>
				<h2>Profil</h2>
				<div className='player-profil'>
					{/* <img src={user?.avatar.path} alt="Logo du joueur" /> */}
					<p>{user?.username}</p>
				</div>
				<div className='player-info'>
					<div className='statistics'>
						<h3>Statistiques du joueur</h3>
						{/* <p>Nombre de games : {user.matchs}</p>
						<p>Win rate : {winrate}%</p> */}
					</div>
					<div className='history'>
						<h3>Historique des parties</h3>
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
		</div>
	);
}

export default Profil;
