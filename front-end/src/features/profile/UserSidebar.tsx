import React, { ChangeEvent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import "./UserSidebar.css"
import { User } from "../../utils/backendInterface";
import Emoji from "../../components/Emoji";
import UsernameLink from "../../components/UsernameLink";
import { AcceptAndDenyFriendButtons } from "./buttons/Buttons";
import { UserContext } from "../../utils/UserContext";
import { SocketContext } from "../../utils/SocketContext";
import { getUserByUsername } from "../../api/User.requests";
import { SockEvent } from "../../utils/backendInterface";

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
	const user = userContext?.user;
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	const [userToFind, setUserToFind] = React.useState<string>("");

	function setUser(e: ChangeEvent<HTMLInputElement>) {
		setUserToFind(e.target.value);
	}

	function resize(id: string, size: string) {
		const location = document.getElementById(id);
		if (location)
			location.style.width = size;
	}

	useEffect(() => {
		resize("input", "80%");
	})

	const listFriends = user?.friends?.map((friend: User) => {
		return (
			<div className="friend" key={friend.id}>
				<img src={"../../" + friend?.avatarPath} alt="Logo du joueur" />
				<div>
					<UsernameLink user={friend} />
					{renderSwitch(friend.status)}
				</div>
			</div>
		)
	})

	const listFriendsInvite = user?.friendRequests?.map((friend: User) => {
		return (
			<div className="friendInvite" key={friend.id}>
				<img src={"../../" + friend?.avatarPath} alt="Logo du joueur" />
				<UsernameLink user={friend} />
				<div>
					<AcceptAndDenyFriendButtons username={friend.username} />
				</div>
			</div>
		)
	})

	useEffect(() => {
		async function statusListener(id: number, newStatus: number) {
			let clone: User | undefined = { ...user as any };
			let friend = clone!.friends?.find((friend) => { return friend.id === id });
			if (friend) {
				friend.status = newStatus;
				clone?.friends.sort((a, b) => {
					if (a.status && b.status)
						return (a.username > b.username ? -1 : 1);
					else
						return (a.status > b.status ? -1 : 1);
				});
				userContext?.setUser(clone);
			}
		}

			socket?.on(SockEvent.SE_US_STATUS, (data) => { statusListener(data.friendId, data.newStatus) });
			return () => {
				socket?.off(SockEvent.SE_US_STATUS, (data) => { statusListener(data.friendId, data.newStatus) });
			}
		})

	async function handleClick() {
		if (userToFind) {
			const user = await getUserByUsername(userToFind);
			setUserToFind("")
			if (user)
				navigate("/home/profile/" + user.id);
		}
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	}

	return (
		<div className="userSidebar">
			<input maxLength={16} type="text" onChange={setUser} value={userToFind} placeholder={"Chercher un profil"} onKeyDown={handleKeyDown} />
			<button onClick={handleClick}> <Emoji label="mag" symbol="🔍" /> </button>

			<h4>Amis</h4>
			{listFriends?.length
				? <div className="list">{listFriends}</div>
				: <p>Aucun ami pour le moment</p>
			}

			<h4>Invitations d'amis</h4>
			{listFriendsInvite?.length
				? <div className="listinvite">{listFriendsInvite}</div>
				: <p>Aucune demande d'ami pour le moment</p>
			}
			<br />
			<br />
		</div>
	);
}

export default UserSidebar;
