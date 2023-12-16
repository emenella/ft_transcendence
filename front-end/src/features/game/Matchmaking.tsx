import React, { useState } from 'react';
import './Matchmaking.css';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';

const Matchmaking = () => {
	const [isSearching, setIsSearching] = useState(false);
	const [height] = useState(1080);
	const [width] = useState(1920);

	const joinQueueHandler = () => {
		setIsSearching(true);
	};

	const leaveQueueHandler = () => {
		setIsSearching(false);
	};

	return (
		<div className="game">
			<div className="pong">
				<PongGame
					width={width}
					height={height}
					isQueue={isSearching}
					spec={null}
					handlefound={leaveQueueHandler}
				/>
			</div>
			<div className='matchmaking'>
				{
					isSearching
					? <LeaveButton onClick={leaveQueueHandler}></LeaveButton>
					: <SearchButton onClick={joinQueueHandler}></SearchButton>
				}
			</div>
		</div>
	);
};

export default Matchmaking;
