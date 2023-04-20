import React, { useState, useEffect } from 'react';
import './Matchmaking.css';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';

const Matchmaking = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  const joinQueueHandler = () => {
    setIsSearching(true);
  };

  const leaveQueueHandler = () => {
    setIsSearching(false);
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     setHeight(window.innerHeight);
  //     setWidth(window.innerWidth);
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  return (
    <div className="matchmaking">
      <div className="main">
        <div className="logo">
          <PongGame
            width={width}
            height={height}
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
