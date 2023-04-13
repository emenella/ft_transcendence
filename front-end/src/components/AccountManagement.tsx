import React, { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Link, redirect } from 'react-router-dom';
import './AccountManagement.css'
import { getMe, setUsername, uploadAvatar, delete2FA, deleteAccount } from '../api/User';
import { AccountManagementState } from '../utils/interface';
import Emoji from './Emoji';

class AccountManagement extends React.Component<any, AccountManagementState> {
	state: AccountManagementState = {
		username: '',
		image: undefined,
		id: 0
	}

	constructor(props: any) {
		super(props);
		this.setUsername = this.setUsername.bind(this);
		this.setImage = this.setImage.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setId = this.setId.bind(this);
	}

	async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (this.state.username !== '')
		{
			const req = await setUsername(this.state.username);
			if (req?.status === 201)
				toast.success('Pseudo enregistré.');
			else
				toast.error('Erreur. Veuillez réessayer.')
		}
		if (this.state.image) {
			const formData = new FormData();
			formData.append("file", this.state.image);
			const req = await uploadAvatar(formData);
			if (req?.status === 201)
				toast.success('Image enregistrée.');
			else
				toast.error('Erreur. Veuillez réessayer.')
		}
	}

	setUsername(e: ChangeEvent<HTMLInputElement>): void {
		this.setState({ username: e.target.value });
	}

	setImage(e: ChangeEvent<HTMLInputElement>): void {
		this.setState({ image: e.target.files![0] });
	}

	async setId() {
		const getUser = async (): Promise<number> => {
			const tmp = await getMe();
			const user = JSON.parse(tmp);
			return user.id;
		};
		const id = await getUser();
		this.setState({ id: id })
	}

	render() {
		const linkStyle = {
            color: "black",
			textDecoration: "none"
        }

		return (
			<div>
				<Link to={"/"} style={linkStyle}><Emoji label="arrow_left" symbol="⬅️" />Retour au matchmaking</Link>
				<div className='account-management'>
					<h2>Gestion du compte</h2>
					<form onSubmit={this.handleSubmit}>
						<label>Changer de pseudo : </label> <input type="text" onChange={this.setUsername} ></input>
						<br /><br />
						<label>Changer de photo de profil : </label> <input type="file" accept='.PNG,.JPG' onChange={this.setImage} />
						<br /><br />
						<button type="submit">Valider</button>
					</form>
					<br /><br />
					<label>Désactivation 2FA : </label> <button onClick={delete2FA}><Emoji label="heavy_check_mark" symbol="✔️" /></button>
					<br /><br />
					<button onClick={() => { this.setId(); deleteAccount(this.state.id); redirect('/'); }}>Supprimer le compte</button>
				</div>
			</div>
		);
	}
}

export default AccountManagement;
