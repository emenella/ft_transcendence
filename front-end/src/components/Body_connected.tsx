import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Body_connected.css';
import Matchmaking from './Game/Matchmaking';
import Profil from './Profil';
import AccountManagement from './AccountManagement';
import { getMe } from '../api/User';
import Chat from '../chat/Chat';
import { User, Avatar } from '../utils/backend_interface';
import Emoji from './Emoji';
import { accept, deny } from '../utils/friends_system';

function ChatSidebar() {
	return (
		<div className='chatSidebar'>
			<table>
				<thead>
					<tr>
						<th scope='row'>Channels rejoints</th>
						<th scope='row'>+</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Nom du channel</td>
						<td>-</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function UserSidebar() {
	const [user, setUser] = React.useState<User>();
	React.useEffect(() => {
		const getUser = async () => {
			setUser(await getMe());
		};
		getUser();
	}, []);

	const [friends, setFriends] = React.useState<User[]>();
	React.useEffect(() => {
		setFriends(user?.friends);
	}, []);

	const listFriends = friends?.map((friend: User) => {
		const avatar : Avatar = friend?.avatar;

		return(
			<tr>
				<td><img src={avatar?.path} /></td>
				<td>
					<div className='friendStatus'>
						<p>{friend.username}</p>
						{friend.isPlaying
							? <p>En partie <Emoji label="video_game" symbol="🎮" /></p>
							: (
								friend.isConnected
								? <p>En ligne <Emoji label="green_circle" symbol="🟢" /></p>
								: <p>Hors ligne <Emoji label="white_circle" symbol="⚪" /></p>
							)
						}
					</div>
				</td>
			</tr>
		)
	}
	);

	const [friendsInvites, setFriendsInvite] = React.useState<User[]>();
	React.useEffect(() => {
		setFriendsInvite(user?.friend_requests);
	}, []);

	const listFriendsInvite = friendsInvites?.map((friend: User) => {
		const avatar : Avatar = friend?.avatar;

		return(
			<div>
				<tr>Demande d'ami de :</tr>
				<tr>
					<td><img src={avatar?.path} /></td>
					<td>{friend.username}</td>
				</tr>
				<tr>
					<button onClick={() => accept(friend.username)}>Accepter <Emoji label="check_mark" symbol="✔️" /></button>
					ou
					<button onClick={() => deny(friend.username)}>Refuser <Emoji label="cross_mark" symbol="❌" /></button>
				</tr>
			</div>
		)
	}
	);

	return (
		<div className='userSidebar'>
			<table>
				<thead>
					<tr>
						<th scope='row'>Amis</th>
					</tr>
				</thead>
				<tbody>{listFriends}{listFriendsInvite}</tbody>
			</table>
		</div>
	);
}

function ChatFront() {
	return (
		<div className='chat'>
			<table>
				<tbody>
					<tr>
						<td>Bla bla</td>
					</tr>
					<tr>
						<td>Bla bla</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function BodyConnected({ user }: { user: User }) {

	console.log(user);

	return (
		<div className="connected">
			<ChatSidebar />
			<div className="connectedCenter">
				<div>
					<Routes>
						<Route path="/" element={<Matchmaking />} />
						<Route path="/accountmanagement" element={<AccountManagement user={user!} />} />
						<Route path="/profil" element={<Profil id={user?.id!} />} />
					</Routes>
				</div>
				<div>
					<Routes>
						<Route path="/" element={<Chat />} />
					</Routes>
				</div>
				<ChatFront />
			</div>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
