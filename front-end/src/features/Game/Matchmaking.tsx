import React, { useState } from 'react';
import './Matchmaking.css';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';

const Matchmaking = () => {
  const [isSearching, setIsSearching] = useState(false);

  const joinQueueHandler = () => {
    setIsSearching(true);
  };

  const leaveQueueHandler = () => {
    setIsSearching(false);
  };

  return (
    <div className="matchmaking">
      <div className="main">
        <div className="logo">
          <PongGame
            width={800}
            height={600}
            isQueue={isSearching}
            spec={null}
            handlefound={leaveQueueHandler}
          />
        </div>
        <SearchButton
          onClick={joinQueueHandler}
          isSearching={isSearching}
        ></SearchButton>
        {isSearching ? (
          <LeaveButton onClick={leaveQueueHandler}></LeaveButton>
        ) : null}
      </div>
    </div>
  );
};

export default Matchmaking;
