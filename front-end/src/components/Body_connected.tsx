import React from 'react';
import './Body_connected.css';
import { getMe } from '../api/User';
import Chat from '../chat/Chat';
import { User, Avatar } from '../utils/backend_interface';
import Emoji from './Emoji';
import { accept, deny } from '../utils/friends_system';

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
				<tbody>{listFriends}{listFriendsInvite}</tbody>
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
			<Chat user={user}/>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
