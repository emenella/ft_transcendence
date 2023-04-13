import React, { useState, useRef, useEffect } from 'react';
import './Matchmaking.css';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';
import { getToken, url } from '../../api/Api';
import { io, Socket } from 'socket.io-client';

const Matchmaking = () => {
  const [isSearching, setIsSearching] = useState(false);

  const WebMatchmaking = url + '/matchmaking';

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
            token={getToken() as string}
            isQueue={isSearching}
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
