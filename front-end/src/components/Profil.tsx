import React from 'react';
import './Profil.css';

{/* Onglet "Profil" */ }
{/* Besoin de fix l'arrangement photo et pseudo */ }
class Profil extends React.Component {
	render() {
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
}

export default Profil;
