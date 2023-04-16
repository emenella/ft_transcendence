import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Profil.css';
import { getMe, getMatchs, getUserById } from '../api/User';
import Emoji from './Emoji';
import { User, Avatar, Match } from '../utils/backend_interface';
import { invite, remove, blacklist, unblacklist } from '../utils/friends_blacklists_system';

function PlayerInteraction(props : { user : User | undefined, me : User | undefined }) {
	return (
		<div className='player-interaction'>
			{ props.me?.friends.some((friend: User) => friend.id === props.user?.id)
				?	<div>
						<label>Supprimer des amis </label>
						<button onClick={() => { remove(props.user!.username); }}>
							<Emoji label="handshake" symbol="🤝" />
						</button>
					</div>
				:	<div>
						<label>Ajouter en ami </label>
						<button onClick={() => { invite(props.user!.username); }}>
							<Emoji label="handshake" symbol="🤝" />
						</button>
					</div>
			}
			<div>
				<label>Proposer une partie </label>
				<button onClick={() => {  }}>
					<Emoji label="crossed_swords" symbol="⚔️" />
				</button>
			</div>
			<div>
				<label>Regarder sa partie </label>
				<button onClick={() => {  }}>
					<Emoji label="tv" symbol="📺" />
				</button>
			</div>
			{ props.me?.blacklist.some((friend: User) => friend.id === props.user?.id)
				?	<div>
						<label>Débloquer l'utilisateur </label>
						<button onClick={() => { unblacklist(props.user!.username); }}>
							<Emoji label="no_entry_sign" symbol="🚫" />
						</button>
					</div>
				:	<div>
						<label>Bloquer l'utilisateur </label>
						<button onClick={() => { blacklist(props.user!.username); }}>
							<Emoji label="no_entry_sign" symbol="🚫" />
						</button>
					</div>
			}
			<div>
				<label>Discussion privée </label>
				<button onClick={() => {  }}>
					<Emoji label="speech_balloon" symbol="💬" />
				</button>
			</div>
		</div>
	);
}

function PrintMatch(props : { username: string | undefined, match: Match }) {
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

function Profil() {
	let id = parseInt(useParams<{ id: string }>().id!);

	const [user, setUser] = React.useState<User>();
	React.useEffect(() => {
		const getUser = async () => {
			setUser(await getUserById(id));
		};
		getUser();
	}, [id]);

	const [matchs, setMatchs] = React.useState<Match[]>();
	React.useEffect(() => {
		const getUserMatchs = async () => {
			setMatchs(await getMatchs(id));
		};
		getUserMatchs();
	}, [id]);

	const [avatar, setAvatar] = React.useState<Avatar>();
	React.useEffect(() => {
		setAvatar(user?.avatar);
	}, [user]);

	const [me, setMe] = React.useState<User>();
	React.useEffect(() => {
		const getUser = async () => {
			setMe(await getMe());
		};
		getUser();
	}, []);

	const wins = user?.winMatch.length;
	const loses = user?.looseMatch.length;
	const games = matchs?.length;
	const winrate = ((wins! / games!) * 100) || 0;

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
					<img src={"../" + avatar?.path} alt="Logo du joueur" />
					<h3>{user?.username}</h3>
				</div>
				{ (user?.id === me?.id)
					? <></>
					:	<PlayerInteraction user={user} me={me} />
				}
				<div className='player-info'>
					<div className='statistics'>
						<h3>Statistiques du joueur</h3>
						<p>Nombre de parties jouées : {games}</p>
						<p>Nombre de parties gagnées : {wins}</p>
						<p>Nombre de parties perdues : {loses}</p>
						<p>Win rate : {winrate}%</p>
						<p>Elo : {user?.elo}</p>
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
								{matchs?.map((match: Match) => { return(<PrintMatch username={user?.username} match={match} />); })}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profil;
