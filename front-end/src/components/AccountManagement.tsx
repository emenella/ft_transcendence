import React, { ChangeEvent, useState,  } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import './AccountManagement.css'
import { setUsername, uploadAvatar, delete2FA, getMe } from '../api/User';
import { AccountManagementProps, AccountManagementState } from '../utils/interface';
import Emoji from './Emoji';

function Deactivation2FA({onClick}: {onClick: () => void}) {
	
	
	return(
		<div>
			<button onClick={onClick}>Désactivation 2FA <Emoji label="cross_mark" symbol="❌" /></button>
		</div>
	)
};

function Activation2FA() {
	const navigate = useNavigate();

	function move() {
		navigate("/2fa");
	}

	return(
		<div>
			<button onClick={move}>Activation 2FA <Emoji label="check_mark" symbol="✔️" /></button>
		</div>
	)
};

function AccountManagement({ user }: AccountManagementProps) {
  const [username, SetUsername] = useState('');
  const [image, setImage] = useState<File>();
  const [activated2FA, setActivated2FA] = useState(user.is2FAActivated);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username !== '') {
      const req = await setUsername(username);
      if (req?.status === 201) toast.success('Pseudo enregistré.');
      else toast.error('Erreur. Veuillez réessayer.');
    }
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const req = await uploadAvatar(formData);
      if (req?.status === 201) toast.success('Image enregistrée.');
      else toast.error('Erreur. Veuillez réessayer.');
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
    SetUsername(e.target.value);
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
        <Emoji label="arrow_left" symbol="⬅️" />
        Retour au matchmaking
      </Link>
      <div className="account-management">
        <h2>Gestion du compte</h2>
        <form onSubmit={handleSubmit}>
          <label>Changer de pseudo : </label>{' '}
          <input type="text" onChange={handleUsernameChange}></input>
          <br />
          <br />
          <label>Changer de photo de profil : </label>{' '}
          <input type="file" accept=".PNG,.JPG" onChange={handleImageChange} />
          <br />
          <br />
          <button type="submit">Valider</button>
        </form>
        <br />
        <br />
        <div>{activated2FA ? <Deactivation2FA onClick={handle2FADelete} /> : <Activation2FA />}</div>
      </div>
    </div>
  );
}

export default AccountManagement;
