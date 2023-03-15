import React from 'react';
import './AccountManagement.css'
import { deleteAccount } from '../api/User';

{/* Onglet "Gestion du compte" */ }
// ajouter redirection vers page d'accueil via setToken
class AccountManagement extends React.Component {
	render() {
		return (
			<div className='account-management'>
				<h2>GESTION DU COMPTE</h2>
				<form action="/api/users/{id}" method='put'>
					<label>Changer de photo de profil : </label> <input type="file" accept='.PNG,.JPG' /> <br />
					<button type="submit">Valider</button>
				</form>
				<br />
				<button onClick={deleteAccount}>Supprimer le compte</button>
			</div>
		);
	}
}

export default AccountManagement;
