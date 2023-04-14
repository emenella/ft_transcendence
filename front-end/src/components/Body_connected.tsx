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

function renderSwitch(num: number) {
	switch (num) {
		case 0:
			return ( <p>Hors ligne <Emoji label="white_circle" symbol="⚪" /></p> );
		case 1:
			return ( <p>En ligne <Emoji label="green_circle" symbol="🟢" /></p> );
		case 2:
			return ( <p>En partie <Emoji label="video_game" symbol="🎮" /></p> );
		// case 3:
		// 	return ( <p>Inactif <Emoji label="yellow_circle" symbol="🟡" /></p> );
	}
};

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
						{renderSwitch(friend.status)}
					</div>
				</td>
			</tr>
		)
	}
	);

	const [friendsInvites, setFriendsInvite] = React.useState<User[]>();
	React.useEffect(() => {
		setFriendsInvite(user?.friend_invites);
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
				<tbody>
					{listFriends}
					{listFriendsInvite}
				</tbody>
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

function BodyConnected() {
	const [user, setUser] = React.useState<User>();
	React.useEffect(() => {
		const getUser = async () => {
			setUser(await getMe());
		};
		getUser();
	}, []);

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
