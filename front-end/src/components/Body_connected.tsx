import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Body_connected.css';
import Matchmaking from './Game/Matchmaking';
import Profil from './Profil';
import AccountManagement from './AccountManagement';

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

class BodyConnected extends React.Component {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="connected">
				<ChatSidebar />
				<div className="connectedCenter">
					<div>
						<Routes>
							<Route path="/" element={<Matchmaking />} />
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
}

export default BodyConnected;
