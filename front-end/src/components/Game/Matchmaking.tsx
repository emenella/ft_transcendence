import React, { useState, useRef, useEffect } from 'react';
import './Matchmaking.css';
import logo_matchmaking from '../../assets/logo_pong.jpg';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';
import { getToken, url } from '../../api/Api';
import { io, Socket } from 'socket.io-client';

const Matchmaking = () => {
  const [isSearching, setIsSearching] = useState(false);
  const pongGameRef = useRef<PongGame>(null);
  const [getSocket, setSocket] = useState<Socket>();

  const WebMatchmaking = url + '/matchmaking';

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
    setSocket(io(WebMatchmaking, { extraHeaders: { Authorization: getToken() as string } }))
    console.log("useEffect socket")
    // ... setup socket listeners
    return () => {
      // ... cleanup socket listeners
      getSocket?.disconnect();

    };
  }, []);

  useEffect(() => {
    searchGame();
  }, [getSocket]);

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
            socketMatchmaking={getSocket as Socket}
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
