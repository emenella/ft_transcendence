import React from 'react';
import './App.css'
import logo from './assets/black_logo.png';
import Footer from './components/Footer';
import HeaderConnected from './components/Header_connected';
import HeaderNotConnected from './components/Header_not_connected';
import BodyNotConnected from './components/Body_not_connected';
import BodyConnected from './components/Body_connected';
import { Token } from './utils/interface';

class App extends React.Component<Token, any> {
	constructor(props: Token) {
		super(props);
		this.setToken = this.setToken.bind(this);
		this.state = { has_token: props.hasToken };
	}

	setToken(): void {
		this.setState({ has_token: localStorage.getItem('token') !== null });
	}

	render() {
		if (this.state.has_token)
			return (
				<div>
					<div className='flex-container'>
						<div> <img src={logo} alt='Logo du site' /> </div>
						<div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
						<div> <HeaderConnected setToken={this.setToken} /> </div>
					</div>
					<BodyConnected />
					<Footer />
				</div>
			);
		else
			return (
				<div>
					<div className='flex-container'>
						<div> <img src={logo} alt='Logo du site' /> </div>
						<div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
						<div> <HeaderNotConnected setToken={this.setToken} /> </div>
					</div>
					<BodyNotConnected />
					<Footer />
				</div>
			);
	}
}

export default App;
