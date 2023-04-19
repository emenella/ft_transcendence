import React from 'react';
import App from '../../App';
import { Route, Routes, Navigate } from 'react-router-dom';
import './Body_connected.css';
import Profile from '../Profile/Profile';
import AccountManagement from '../Profile/AccountManagement';
import UserSidebar from '../Profile/UserSidebar';
import Chat from '../Chat/Chat';
import Matchmaking from '../Game/Matchmaking';
import PongGame from '../Game/PongGame';
import { User } from '../../utils/backend_interface';

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

function ChatFront() {
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


function BodyConnected({ user }: { user: User }) {
	return (
		<div className="connected">
			<Chat user={user}/>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
