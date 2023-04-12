import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Body_connected.css';
import Matchmaking from './Game/Matchmaking';
import Profil from './Profil';
import AccountManagement from './AccountManagement';
import { getMe, getFriends } from '../api/User';
import Chat from '../chat/Chat';
import { User } from '../utils/backend_interface';

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
	const [friends, setFriends] = React.useState<any>();
	React.useEffect(() => {
		const getFriendsList = async () => {
			setFriends(await getFriends());
		};
		getFriendsList();
	}, []);

	const listFriends = friends?.map((friend: any) => {
		<tr>
			<td><img src={friend.avatar.path} /></td>
			<td>{friend.username}</td>
		</tr>
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
				<tbody>{listFriends}</tbody>
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
	const [user, setUser] = React.useState<any>();
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
						<Route path="/accountmanagement" element={<AccountManagement />} />
						<Route path="/profil" element={<Profil id={user?.id} />} />
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
