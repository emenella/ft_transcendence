import React from 'react';
import { Link } from 'react-router-dom';
import './Profil.css';
import { getMatchs, getUserById } from '../api/User';
import Emoji from './Emoji';
import { User, Avatar, MatchHistory } from '../utils/backend_interface';

function Match(props : { username: string, match: any}) {
	if (props.match.winner.username === props.username) {
		return (
			<div className="winner">
				<tr>
					<td>{props.match.winner.username} VS {props.match.loser.username}</td>
					<td>{props.match.scores[0]} - {props.match.scores[1]}</td>
				</tr>
			</div>
		);
	}
	else {
		return (
			<div className="loser">
				<tr>
					<td>{props.match.loser.username} VS {props.match.winner.username}</td>
					<td>{props.match.scores[1]} - {props.match.scores[0]}</td>
				</tr>
			</div>
		);
	}
}

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
			setMatchs(await getMatchs(props.id));
		};
		getUserMatchs();
	}, [props.id]);

	// const wins = user!.winMatch.length;
	// const loses = user!.looseMatch.length;
	// const games = matchs!.length;
	// const winrate = (wins! / games!) * 100;

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
					<img src={user?.avatar.path} alt="Logo du joueur" />
					<p>{user?.username}</p>
				</div>
				<div className='player-info'>
					<div className='statistics'>
						<h3>Statistiques du joueur</h3>
						{/* <p>Nombre de parties : {games}</p> */}
						{/* <p>Nombre de parties gagnées : {wins}</p> */}
						{/* <p>Nombre de parties perdues : {loses}</p> */}
						{/* <p>Win rate : {winrate}%</p> */}
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
							<tbody>
								{matchs?.map((match: any) => { return(<Match username={user.username} match={match} />); })}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profil;
