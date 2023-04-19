import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './Body_connected.css';
import Profile from '../Profile/Profile';
import AccountManagement from '../Profile/AccountManagement';
import UserSidebar from '../Profile/UserSidebar';
import Matchmaking from '../Game/Matchmaking';
import PongGame from '../Game/PongGame';

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


function BodyConnected() {
	return (
		<div className="connected">
			<ChatSidebar />
			<div className="connectedCenter">
				<div>
					<Routes>
						<Route index element={<Matchmaking />}></Route>
							<Route path="profile/:id" element={<Profile />} />
							<Route path="accountmanagement" element={<AccountManagement />} />
							<Route path="spec/:id" element={<PongGame height={600} width={800} spec={null} isQueue={false} handlefound={() => {}} />} />
							<Route path="*" element={<Navigate to="/home" replace />} />
					</Routes>
				</div>
				<ChatFront />
			</div>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
