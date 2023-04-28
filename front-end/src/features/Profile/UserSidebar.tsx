import React, { ChangeEvent, useContext, useEffect } from "react";
import "./UserSidebar.css"
import { SockEvent, User } from "../../utils/backendInterface";
import { notification, invite } from "../../utils/friends_blacklists_system";
import Emoji from "../../components/Emoji";
import UsernameLink from "../../components/UsernameLink";
import { AcceptAndDenyFriendButtons } from "./buttons/Buttons";
import { UserContext } from "../../utils/UserContext";
import { SocketContext } from "../../utils/SocketContext";
import { getMe } from "../../api/User";

function renderSwitch(num: number) {
	switch (num) {
		case 0:
			return (<p>Hors ligne <Emoji label="white_circle" symbol="⚪" /></p>);
		case 1:
			return (<p>En ligne <Emoji label="green_circle" symbol="🟢" /></p>);
		case 2:
			return (<p>En partie <Emoji label="video_game" symbol="🔵" /></p>);
	}
};

function UserSidebar() {
	const userContext = useContext(UserContext);
	const [user, setUser] = React.useState<User>(userContext?.user as User);
	const socket = useContext(SocketContext);
	const [listFriends, setListFriends] = React.useState<JSX.Element[]>();
	const [listFriendsInvite, setListFriendsInvite] = React.useState<JSX.Element[]>();
	
	const getListFriend = () => {
		return user?.friends?.map((friend: User) => {
		return (
			<div className="friend" key={friend.id}>
				<img src={"../../" + friend?.avatarPath} alt="Logo du joueur" />
				<div>
					<UsernameLink user={friend} />
					{renderSwitch(friend.status)}
				</div>
			</div>
			)
		});
	}
	const getListFriendInvite = () => {
		return user?.friendRequests?.map((friend: User) => {
		return (
			<div className="friend-invite" key={friend.id}>
				<img src={"../../" + friend?.avatarPath} alt="Logo du joueur" />
				<UsernameLink user={friend} />
				<div>
					<AcceptAndDenyFriendButtons username={friend.username} />
				</div>
			</div>
		)});
	}
	useEffect(() => {
		async function fetch() {
			setUser(await getMe());
		}
		const handleUpdate = async (data: any) => {
			await fetch();
		}

		fetch().then(() => {
		setListFriends(getListFriend());
		setListFriendsInvite(getListFriendInvite());
		});
		socket?.on(SockEvent.SE_FRONT_NOTIFY, notification);
		socket?.on(SockEvent.SE_FRONT_UPDATE, handleUpdate);
		return () => {
			socket?.off(SockEvent.SE_FRONT_UPDATE, handleUpdate);
			socket?.off(SockEvent.SE_FRONT_NOTIFY, notification);
		}
	}, []);

	useEffect(() => {
		setListFriends(getListFriend());
		setListFriendsInvite(getListFriendInvite());
	}, [user]);


	

	const [friendToAdd, setFriendToAdd] = React.useState<string>();

	function setFriend(e: ChangeEvent<HTMLInputElement>) {
		setFriendToAdd(e.target.value);
	}

	function addFriend() {
		if (friendToAdd)
			invite(friendToAdd);
	}

	return (
		<div className="userSidebar">
			<h4>Amis</h4>
			{   listFriends?.length
				? <div>{listFriends}</div>
				: <p>Aucun ami pour le moment</p>
			}

			<h4>Invitations d'amis</h4>
			{   listFriendsInvite?.length
				? <div>{listFriendsInvite}</div>
				: <p>Aucune demande d'ami pour le moment</p>
			}

			<h4>Ajouter un ami</h4>
			<input maxLength={4096} type="text" onChange={setFriend} />
			<button onClick={addFriend}> <Emoji label="heavy_plus_sign" symbol="➕" /> </button>
		</div>
	);
}

export default UserSidebar;
