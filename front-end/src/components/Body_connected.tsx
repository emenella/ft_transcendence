import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Body_connected.css';
import logo_matchmaking from '../assets/logo_pong.jpg';
import { deleteAccount } from '../api/User';

// map sur retour de l'API pour afficher
function ChatSidebar() {
	return (
		<div className='chatSidebar'>
			<table>
				<thead>
					<tr>
						<th scope='row'>Channels rejoints</th>
						<th scope='row'>+</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Nom du channel</td>
						<td>-</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

// map sur retour de l'API pour afficher
function UserSidebar() {
	return (
		<div className='userSidebar'>
			<form action="?" method="post">
				<label>Ajouter un ami : </label><input type="text" />
			</form>
			<br />
			<table>
				<thead>
					<tr>
						<th scope='row'>Amis</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>pdp</td>
						<td>pseudo</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function Chat() {
	return (
		<div className='chat'>
			<table>
				<tbody>
					<tr>
						<td>Bla bla</td>
					</tr>
					<tr>
						<td>Bla bla</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

{/* Onglet "Profil" */ }
{/* Besoin de fix l'arrangement photo et pseudo */ }
function Profil() {
	return (
		<div className='profil'>
			<h2>PROFIL</h2>
			<div className='player-profil'>
				{/* GET /api/users/{id} */}
				<img src="" alt="Logo du joueur" />
				<p>Pseudo</p>
			</div>
			<div className='player-info'>
				<div className='statistics'>
					<h2>Statistiques du joueur</h2>
					{/* GET /api/users/{id} */}
					<p>Nombre de games : </p>
					<p>Win rate : </p>
					<p>[...] : </p>
					<p>[...] : </p>
				</div>
				<div className='history'>
					<h2>Historique des parties</h2>
					{/* GET /api/history  */}
					<table>
						<thead>
							<tr>
								<th scope='row'>Combat</th>
								<th scope='row'>Résultat</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Appel API VS Appel API</td>
								<td>Autre appel API</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

{/* Onglet "Gestion du compte" */ }
// ajouter redirection vers page d'accueil via setToken
function AccountManagement() {
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

{/* Onglet "Jouer" */ }
function Matchmaking() {
	return (
		<div className='matchmaking'>
			<h2>JOUER</h2>
			<div className='matchmaking_mode'>
				<img src={logo_matchmaking} alt="Logo du matchmaking aléatoire" />
				<p>Matchmaking aléatoire</p>
			</div>
			<br />
			<div className='matchmaking_mode'>
				<img src={logo_matchmaking} alt="Logo de la map 1" />
				<p>Map 1</p>
			</div>
			<br />
			<div className='matchmaking_mode'>
				<img src={logo_matchmaking} alt="Logo de la map 2" />
				<p>Map 2</p>
			</div>
			<br />
			<div className='matchmaking_mode'>
				<img src={logo_matchmaking} alt="Logo de la map 3" />
				<p>Map 3</p>
			</div>
		</div>
	);
}

function BodyConnected() {
	return (
		<div className='connected'>
			<ChatSidebar />
			<div className='connectedCenter'>
				<div>
                	<Routes>
                	    <Route path="/matchmaking" element={<Matchmaking />} />
                	    <Route path="/accountmanagement" element={<AccountManagement />} />
                	    <Route path="/profil" element={<Profil />} />
                	</Routes>
				</div>
				<Chat />
			</div>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
