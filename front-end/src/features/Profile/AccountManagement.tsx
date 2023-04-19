import React, { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AccountManagement.css'
import Emoji from '../../components/Emoji';
import { Enable2FA, Disable2FA } from '../../components/button/Buttons';
import { changeUsername, uploadAvatar, delete2FA } from '../../api/User';
import { User } from '../../utils/backend_interface';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';

function AccountManagement() {
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    const [username, setUsername] = useState('');
    const [image, setImage] = useState<File>();
    const [activated2FA, setActivated2FA] = useState(user!.is2FAActivated);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username !== '') {
            await changeUsername(username);
			user!.username = username;
			setUsername('');
        }
        if (image) {
            const formData = new FormData();
            formData.append('file', image);
            await uploadAvatar(formData);
			setImage(undefined);
        }
    };

    const handle2FADelete = async () => {
        const req = await delete2FA();
        if (req?.status === 200) {
            setActivated2FA(false);
            toast.success('2FA désactivé.');
        } else toast.error('Erreur. Veuillez réessayer.');
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.files?.[0]);
    };

    const linkStyle = {
        color: 'black',
        textDecoration: 'none',
    };

    return (
        <div>
            <Link to={'/'} style={linkStyle}>
                <Emoji label="arrow_left" symbol="⬅️" /> Retour au matchmaking
            </Link>
            <div className="account-management">
                <h2>Gestion du compte</h2>
                <form onSubmit={handleSubmit}>
                    <label>Pseudonyme : </label>{' '}
                    <input type="text" placeholder={user!.username} value={username} onChange={handleUsernameChange}></input>
                    <br />
                    <br />
                    <label>Avatar : </label>{' '}
                    <input type="file" accept=".PNG,.JPG,.JPEG,.GIF" onChange={handleImageChange} />
                    <br />
                    <br />
                    <button type="submit">Valider</button>
                </form>
                <br />
                <br />
                <div>{ activated2FA ? <Disable2FA onClick={handle2FADelete} /> : <Enable2FA /> }</div>
            </div>
        </div>
    );
}

export default AccountManagement;
