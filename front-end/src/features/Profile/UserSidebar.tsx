import React, { ChangeEvent } from 'react';
import './UserSidebar.css'
import { getMe } from '../../api/User';
import { User } from '../../utils/backend_interface';
import { invite, accept, deny } from '../../utils/friends_blacklists_system';
import Emoji from '../../components/Emoji';
import UsernameLink from '../../components/UsernameLink';
import { AcceptAndDenyFriendButtons } from '../../components/button/Buttons';

function renderSwitch(num: number) {
    switch (num) {
        case 0:
            return (<p>Hors ligne <Emoji label="white_circle" symbol="⚪" /></p>);
        case 1:
            return (<p>En ligne <Emoji label="green_circle" symbol="🟢" /></p>);
        case 2:
            return (<p>En partie <Emoji label="video_game" symbol="🔵" /></p>);
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
	
    const listFriends = friends?.map((friend: User) => {
        return (
            <div className='friend'>
                <img src={"../" + friend?.avatarPath} alt="Logo du joueur" />
                <div>
                    <UsernameLink user={friend} />
                    {renderSwitch(friend.status)}
                </div>
            </div>
        )
    }
    );

    const [friendsInvites, setFriendsInvite] = React.useState<User[]>();
    React.useEffect(() => {
        setFriendsInvite(user?.friend_requests);
    }, [user]);

    const listFriendsInvite = friendsInvites?.map((friend: User) => {
        return (
            <div className='friend-invite'>
                <img src={"../" + friend?.avatarPath} alt="Logo du joueur" />
                <UsernameLink user={friend} />
                <div>
                    <AcceptAndDenyFriendButtons username={friend.username} />
                </div>
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
            <h4>Amis</h4>
            {listFriends?.length
                ? <div>{listFriends}</div>
                : <p>Aucun ami pour le moment</p>
            }

            <h4>Invitations d'amis</h4>
            {listFriendsInvite?.length
                ? <div>{listFriendsInvite}</div>
                : <p>Aucune demande d'ami pour le moment</p>
            }

            <h4>Ajouter un ami</h4>
            <input type='text' onChange={setFriend} />
            <button onClick={addFriend}> <Emoji label="heavy_plus_sign" symbol="➕" /> </button>
        </div>
    );
}

export default UserSidebar;
