import React, { ChangeEvent } from 'react';
import { Link, redirect } from 'react-router-dom';
import './AccountManagement.css'
import { getMe, setUsername, uploadAvatar, delete2FA, deleteAccount } from '../api/User';

{/* Onglet "Gestion du compte" */ }
class AccountManagement extends React.Component {
	state = {
		username : '',
		image : ''
	}

	constructor(props: any) {
		super(props);
		this.setUsername = this.setUsername.bind(this);
		this.setImage = this.setImage.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		if (this.state.username !== '')
			setUsername(this.state.username);
		if (this.state.image !== '')
		{
			const formData = new FormData();
			formData.append("avatar", this.state.image);
			uploadAvatar(formData);
		}
	}

	setUsername(e: ChangeEvent<HTMLInputElement>) : void {
		this.setState({ username : e.target.value });
	}

	setImage(e: ChangeEvent<HTMLInputElement>) : void {
		this.setState({ image : e.target.files });
	}

	deleteUser() {
		const [user, setUser] = React.useState<any>();
		React.useEffect(() => {
			const getUser = async () => {
				const tmp = await getMe();
				setUser(JSON.parse(tmp));
			};
			getUser();
		}, []);
		deleteAccount(user.id);
		redirect('*');
	}

	render() {
		return (
			<div className='account-management'>
				<Link to={"/"}>&#60;- Retour au matchmaking</Link>
				<h2>GESTION DU COMPTE</h2>
				<form onSubmit={this.handleSubmit}>
					<label>Changer de pseudo : </label> <input type="text" onChange={this.setUsername} ></input> <br />
					<label>Changer de photo de profil : </label> <input type="file" accept='.PNG,.JPG' onChange={this.setImage} /> <br />
					<button type="submit">Valider</button>
				</form>
				<br />
				<label>Désactivation 2FA : </label> <button onClick={delete2FA} />
				<br />
				<button onClick={this.deleteUser}>Supprimer le compte</button>
			</div>
		);
	}
}

export default AccountManagement;
