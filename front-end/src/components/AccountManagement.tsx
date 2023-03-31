import React, { ChangeEvent } from 'react';
import { Link, redirect } from 'react-router-dom';
import './AccountManagement.css'
import { getMe, setUsername, uploadAvatar, delete2FA, deleteAccount } from '../api/User';

{/* Onglet "Gestion du compte" */ }

interface AccountManagementState
{
	username : string;
	image: File | undefined;
	id : number;
}


class AccountManagement extends React.Component<any, AccountManagementState> {
	state: AccountManagementState = {
		username : '',
		image: undefined,
		id : 0
	}

	constructor(props: any) {
		super(props);
		this.setUsername = this.setUsername.bind(this);
		this.setImage = this.setImage.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setId = this.setId.bind(this);
	}

	async handleSubmit() {
		if (this.state.username !== '')
			await setUsername(this.state.username);
		if (this.state.image)
		{
			console.log(this.state.image);
			const formData = new FormData();
			formData.append("file", this.state.image);
			await uploadAvatar(formData);
		}
	}

	setUsername(e: ChangeEvent<HTMLInputElement>) : void {
		this.setState({ username : e.target.value });
	}

	setImage(e: ChangeEvent<HTMLInputElement>) : void {
		this.setState({ image : e.target.files![0] });
	}

	async setId() {
		const getUser = async (): Promise<number> => {
			const tmp = await getMe();
			const user = JSON.parse(tmp);
			return user.id;
		};
		const id = await getUser();
		this.setState({ id : id})
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
				<button onClick={() => { this.setId(); deleteAccount(this.state.id); redirect('*'); }}>Supprimer le compte</button>
			</div>
		);
	}
}

export default AccountManagement;
