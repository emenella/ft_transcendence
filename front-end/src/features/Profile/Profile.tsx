import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Profile.css';
import { getMatchs, getUserById } from '../../api/User';
import Emoji from '../../components/Emoji';
import { AddFriendButton, RemoveFriendButton, DuelButton, SpectateButton, BlacklistButton, UnblacklistButton } from '../../components/button/Buttons';
import { User, Match } from '../../utils/backend_interface';

function PlayerInteraction({ user, me }: { user: User | undefined, me: User | undefined }) {
	return (
		<div className='player-interaction'>
			{
				me?.friends.some((friend: User) => { return friend.id === user?.id })
				? <RemoveFriendButton username={ user?.username } />
				: <AddFriendButton username={ user?.username } />
			}
			<DuelButton />
			<SpectateButton />
			{
			me?.blacklist.some((friend: User) => { return friend.id === user?.id })
				? <UnblacklistButton username={ user?.username } />
				: <BlacklistButton username={ user?.username } />
			}
		</div>
	);
}

function PrintMatch({ username, match }: { username: string | undefined, match: Match }) {
	if (match.winner.username === username) {
		return (
			<div className="winner">
				<p>{match.winner.username} VS {match.loser.username}</p>
				<p>{match.scores[0]} - {match.scores[1]}</p>
			</div>
		);
	}
	else {
		return (
			<div className="loser">
				<p>{match.loser.username} VS {match.winner.username}</p>
				<p>{match.scores[1]} - {match.scores[0]}</p>
			</div>
		);
	}
}

function Profile({ me }: { me: User }) {
	let id = parseInt(useParams().id!);

	const [user, setUser] = React.useState<User>();
	const [matchs, setMatchs] = React.useState<Match[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>("");
	
	React.useEffect(() => {
		const getUser = async () => {
			const user = await getUserById(id).catch((err) => {
				setError(err);
			});
			setUser(user!);
			setLoading(false);
		}
		getUser();
	}, [id]);
	
	React.useEffect(() => {
		const getUserMatchs = async () => {
			const match = await getMatchs(user!.id).catch((err) => {
				setError(err);
			});
			setMatchs(match!);
		};
		getUserMatchs();
	}, [user]);

	if (error) {
		return (<div>{error}</div>);
	}

	if (loading) {
		return (<div>Chargement...</div>);
	}

	const wins = user!.winMatch.length;
	const loses = user!.loseMatch.length;
	const games = matchs.length;
	const winrate = ((wins! / games!) * 100) || 0;

	const linkStyle = {
		color: "black",
		textDecoration: "none",
		fontSize: "1.4rem"
	}

	return (
		<div>
			<Link to={"/"} style={linkStyle}><Emoji label="arrow_left" symbol="⬅️" />Retour au matchmaking</Link>
			<div className='profil'>
				<h2>Profil</h2>
				<div className='player-profil'>
					<img src={"../" + user?.avatarPath} alt="Logo du joueur" />
					<p>{user?.username}</p>
				</div>
				{ (me.id === user?.id) ? <></> : <PlayerInteraction user={user} me={me} /> }
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
						<h4>Versus | Résultat</h4>
						{ matchs?.map((match: Match) => { return (<PrintMatch username={user?.username} match={match} />); }) }
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;