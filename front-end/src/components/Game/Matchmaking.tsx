import React, { useState, useRef, useEffect } from 'react';
import './Matchmaking.css';
import logo_matchmaking from '../../assets/logo_pong.jpg';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';
import { getToken } from '../../api/Api';
import { io } from 'socket.io-client';

const Matchmaking = () => {
  const [isSearching, setIsSearching] = useState(false);
  const pongGameRef = useRef<PongGame>(null);

  const WebMatchmaking = "https://localhost/matchmaking";

  const joinQueueHandler = () => {
    setIsSearching(true);
    pongGameRef.current?.joinQueue();
  };

  const leaveQueueHandler = () => {
    setIsSearching(false);
    pongGameRef.current?.leaveQueue();
  };

  const searchGame = () => {
    pongGameRef.current?.searchGame();
  };

  useEffect(() => {
    const getUserAndSetGame = async () => {
      searchGame();
    };

    getUserAndSetGame();
  }, []);

  useEffect(() => {
    const socket = io(WebMatchmaking, { extraHeaders: { Authorization: getToken() as string } });
    // ... setup socket listeners
    return () => {
      // ... cleanup socket listeners
      socket.disconnect();
    };
  }, []);

  return (
    <div className="matchmaking">
      <div className="main">
        <div className="logo">
          <img src={logo_matchmaking} alt="Logo du site" />
          <PongGame
            ref={pongGameRef}
            width={800}
            height={600}
            token={getToken() as string}
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
