import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import { getMatchs, getUserById } from "../../api/User.requests";
import Emoji from "../../components/Emoji";
import { AddFriendButton, RemoveFriendButton, DuelButton, BlacklistButton, UnblacklistButton } from "./buttons/Buttons";
import { User, Match } from "../../utils/backendInterface";
import { UserContext } from "../../utils/UserContext";
import { SocketContext } from "../../utils/SocketContext";

function PlayerInteraction({ user, me }: { user: User | undefined, me: User | undefined }) {
	const socket = useContext(SocketContext);

	return (
		<div className="player-interaction">
			{
				me?.friends.some((friend: User) => { return friend.id === user?.id })
					? <RemoveFriendButton username={user?.username} />
					: <AddFriendButton username={user?.username} />
			}
			<DuelButton socket={socket} receiverId={user?.id} />
			{
				me?.blacklist.some((friend: User) => { return friend.id === user?.id })
					? <UnblacklistButton username={user?.username} />
					: <BlacklistButton username={user?.username} />
			}
		</div>
	);
}

function PrintMatch({ id, match }: { id: number | undefined, match: Match }) {
	if (match.winner.id === id) {
		return (
			<div className="win">
				<p>{match.winner.username} VS {match.loser.username} | {match.scores[0]} - {match.scores[1]}</p>
			</div>
		);
	}
	else {
		return (
			<div className="lose">
				<p>{match.loser.username} VS {match.winner.username} | {match.scores[1]} - {match.scores[0]}</p>
			</div>
		);
	}
}

function Profile() {
	const userContext = useContext(UserContext);
	const me = userContext?.user;

	let id = parseInt(useParams().id!);
	const navigate = useNavigate();

	//~~ States
	const [user, setUser] = useState<User>();
	const [matchs, setMatchs] = useState<Match[]>([]);
	const [loading, setLoading] = useState(true);

	//~~ Functions
	React.useEffect(() => {
		async function getUser() {
			const user = await getUserById(id);
			if (!user || !user.isProfileComplete)
				navigate("/error");
			setUser(user);
			setLoading(false);
		}
		getUser();
	}, [id, navigate]);

	React.useEffect(() => {
		async function getUserMatchs() {
			if (user) {
				const match = await getMatchs(user.id);
				setMatchs(match);
			}
		};
		getUserMatchs();
	}, [user]);

	//~~ Body

	const wins = user?.matchsWon.length;
	const loses = user?.matchsLost.length;
	const games = matchs.length;
	const winrate = ((wins! / games!) * 100).toFixed(2) || 0;

    function homeNav() {
        navigate("/home");
    }

	if (loading)
	return <p>Chargement en cours...</p>;

	return (
		<div>
            <button onClick={homeNav}>
			    <Emoji label="arrow_left" symbol="⬅️" /> Retour au matchmaking
            </button>
			<div className="profil">
				<div className="player-profil">
					<img src={"../../" + user?.avatarPath} alt="Avatar du joueur" />
					<h2>{user?.username}</h2>
				</div>
				{(me?.id === user?.id) ? <></> : <PlayerInteraction user={user} me={me} />}
				<div className="player-info">
					<div>
						<h3>Statistiques</h3>
						<p>Parties jouées : {games}</p>
						<p>Parties gagnées : {wins}</p>
						<p>Parties perdues : {loses}</p>
						<p>Ratio de victoire : {winrate}%</p>
						<p>Elo : {user?.elo}</p>
					</div>
					<div>
						<h3>Historique</h3>
						<div className="historic">
							{matchs?.slice(0, 20).map((match: Match) => { return (<PrintMatch id={user?.id} match={match} key={match.id} />); })}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
