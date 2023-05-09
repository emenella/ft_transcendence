import React, { useState, useEffect } from 'react';
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
    <div className="flex justify-center items-center aspect-video">
      <div className="main flex flex-col justify-center items-center max-h-max">
        <div className="logo">
          <PongGame
            width={width}
            height={height}
            isQueue={isSearching}
            spec={null}
            handlefound={leaveQueueHandler}
          />
        </div>
        <div className='flex justify-center items-center mt-8'>
          <SearchButton
            onClick={joinQueueHandler}
            isSearching={isSearching}
          ></SearchButton>
          {isSearching ? (
            <LeaveButton onClick={leaveQueueHandler}></LeaveButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
