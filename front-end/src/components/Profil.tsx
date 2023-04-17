import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Profil.css';
import { getMe, getMatchs, getUserById } from '../api/User';
import Emoji from './Emoji';
import { User, Match } from '../utils/backend_interface';
import { invite, remove, blacklist, unblacklist } from '../utils/friends_blacklists_system';

function PlayerInteraction(props : { user : User | undefined, me : User | undefined }) {
	return (
		<div className='player-interaction'>
			{ props.me?.friends.some((friend: User) => { return friend.id === props.user?.id })
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
			{ props.me?.blacklist.some((friend: User) => { return friend.id === props.user?.id })
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
				<p>{props.match.winner.username} VS {props.match.loser.username}</p>
				<p>{props.match.scores[0]} - {props.match.scores[1]}</p>
			</div>
		);
	}
	else {
		return (
			<div className="loser">
				<p>{props.match.loser.username} VS {props.match.winner.username}</p>
				<p>{props.match.scores[1]} - {props.match.scores[0]}</p>
			</div>
		);
	}
}

function Profil(props: { user: User }) {
	const [matchs, setMatchs] = React.useState<Match[]>([]);
	const [avatar, setAvatar] = React.useState<string>();
	const [observed, setObserved] = React.useState<User>();
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>("");
	let id = parseInt(useParams<{ id: string }>().id!);
	
	React.useEffect(() => {
		console.log(props.user);
		const getUserMatchs = async () => {
			setMatchs(await getMatchs(observed!.id));
			setAvatar(observed!.avatarPath);
		};
		
		getUserMatchs();
	}, [observed]);

	React.useEffect(() => {
		console.log("mount Profil")
		const getUser = async () => {
			const user = await getUserById(id).catch((err) => {
				setError(err);
			});
			setObserved(user!);
			setLoading(false);
	   }
	   getUser();
	}, [id]);
		

	
	console.log(observed, props.user);
	
	if (error) {
		return ( <div>{error}</div> );
	}
	
	if (loading) {
		return ( <div>Chargement...</div> );
	}
	const wins = observed!.winMatch.length;
	const loses = observed!.loseMatch.length;
	const games = matchs.length;
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
					<img src={"../" + observed!.avatarPath} alt="Logo du joueur" />
					<p>{observed!.username}</p>
				</div>
				{ (props.user.id === observed!.id)
					? <></>
					: <PlayerInteraction user={observed} me={props.user} />
				}
				<div className='player-info'>
					<div className='statistics'>
						<h3>Statistiques du joueur</h3>
						<p>Nombre de parties jouées : {games}</p>
						<p>Nombre de parties gagnées : {wins}</p>
						<p>Nombre de parties perdues : {loses}</p>
						<p>Win rate : {winrate}%</p>
						<p>Elo : {observed!.elo}</p>
					</div>
					<div className='history'>
						<h3>Historique des parties</h3>
						<h4>Versus | Résultat</h4>
						{matchs?.map((match: Match) => { return(<PrintMatch username={observed!.username} match={match} />); })}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profil;
