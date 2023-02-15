import React from 'react';
import './User_connected.css';
import logo_matchmaking from '../assets/logo_pong.jpg';

// ajouter boucle
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
						<td>nom du channel</td>
						<td>-</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

// ajouter boucle
function UserSidebar() {
	return (
		<div className='userSidebar'>
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
						<p>Bla bla des autres.</p>
					</tr>
					<tr>
						<p>Mon blabla a écrire et envoyer.</p>
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
function AccountManagement() {
	return (
		<div className='account-management'>
			<h2>GESTION DU COMPTE</h2>
			<form action="/api/users/{id}" method='put'>
				<label htmlFor="pseudo">Changer de pseudo : </label> <input type="text" name="pseudo" id="pseudo" /> <br />
				<label htmlFor="mdp">Changer de mot de passe : </label> <input type="text" name='mdp' id='mdp' /> <br />
				<label htmlFor="pdp">Changer de photo de profil : </label> <input type="file" accept='.PNG,.JPG' name='pdp' id='pdp' /> <br />
				<label htmlFor="auth">Activer l'authentification à double facteur : </label> <input type="checkbox" name="auth" id="auth" value="2F" /> <br />
				<button type="submit">Valider</button>
			</form>
			<br />
			<form action="/api/users/{id}" method="delete">
				<button>Supprimer le compte</button>
			</form>
		</div>
	);
}

{/* Onglet "Jouer" */ }
function Main() {
	// if ()
	//   return <Profil />;
	// else if ()
	//   return <AccountManagement />;
	// else
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

function Connected() {
	return (
		<div className='connected'>
			<ChatSidebar />
			<div className='connectedCenter'>
				<Main />
				<Chat />
			</div>
			<UserSidebar />
		</div>
	);
}

export default Connected;
