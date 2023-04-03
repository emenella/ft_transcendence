import React from 'react';
import './Matchmaking.css';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';
import { getToken } from '../../api/Api';

interface MatchmakingState {
	isSearching: boolean;
	pongGame: React.RefObject<PongGame>;
}

class Matchmaking extends React.Component<any, MatchmakingState> {
	constructor(props: any) {
		super(props);
		console.log(getToken() as string);
		this.state = { isSearching: false, pongGame: React.createRef() };
	}

	joinQueueHandler = () => {
		this.setState({ isSearching: true });
		this.state.pongGame.current?.joinQueue();
	}

	leaveQueueHandler = () => {
		this.setState({ isSearching: false });
		this.state.pongGame.current?.leaveQueue();
	}

	searchGame = () => {
		this.state.pongGame.current?.searchGame();
	}

	async componentDidMount() {
		await this.state.pongGame.current?.getUser();
		await this.state.pongGame.current?.setGame();
		this.searchGame();
	}

	render() {
		return (
			<div className='matchmaking'>
				<PongGame ref={this.state.pongGame} width={800} height={600} token={getToken() as string} />
				<SearchButton onClick={this.joinQueueHandler} isSearching={this.state.isSearching} ></SearchButton>
				{this.state.isSearching ? <LeaveButton onClick={this.leaveQueueHandler} ></LeaveButton> : null}
			</div>
		);
	}
}

export default Matchmaking;
