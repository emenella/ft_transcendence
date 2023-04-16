import React, { ChangeEvent } from 'react';
import './UserSidebar.css'
import { getMe } from '../api/User';
import { User } from '../utils/backend_interface';
import { invite, accept, deny } from '../utils/friends_blacklists_system';
import Emoji from './Emoji';

function renderSwitch(num: number) {
    switch (num) {
        case 0:
            return (<p>Hors ligne <Emoji label="white_circle" symbol="⚪" /></p>);
        case 1:
            return (<p>En ligne <Emoji label="green_circle" symbol="🟢" /></p>);
        case 2:
            return (<p>En partie <Emoji label="video_game" symbol="🎮" /></p>);
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
    }, [user]);
	
	console.log(user);
	console.log(friends);
    const listFriends = friends?.map((friend: User) => {
        return (
            <tr>
                <td><img src={"../" + friend?.avatarPath} /></td>
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
        setFriendsInvite(user?.friend_requests);
    }, [user]);

    const listFriendsInvite = friendsInvites?.map((friend: User) => {
        return (
            <div>
                <tr>
                    <td><img src={"../" + friend?.avatarPath} /></td>
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

    const [friendToAdd, setFriendToAdd] = React.useState<string>();
    function setFriend(e: ChangeEvent<HTMLInputElement>) {
        setFriendToAdd(e.target.value);
    }
    function addFriend() {
        if (friendToAdd)
            invite(friendToAdd);
    }

    return (
        <div className='userSidebar'>
            <table>
                <thead>
                    <tr><th scope='row'>Amis</th></tr>
                </thead>
                {listFriends
                    ? <tbody>{listFriends}</tbody>
                    : <tbody><tr><td>Aucun ami pour le moment</td></tr></tbody>
                }
            </table>
            <table>
                <thead>
                    <tr><th scope='row'>Invitations</th></tr>
                </thead>
                {listFriendsInvite
                    ? <tbody>{listFriendsInvite}</tbody>
                    : <tbody><tr><td>Aucune demande d'ami pour le moment</td></tr></tbody>
                }
            </table>
            <table>
                <thead>
                    <tr><th scope='row'>Ajouter un ami</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type='text' onChange={setFriend} />
                            <button onClick={addFriend}> <Emoji label="heavy_plus_sign" symbol="➕" /> </button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default UserSidebar;
