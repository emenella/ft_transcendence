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
  const [pongGame, setGame] = useState(useRef<PongGame>(null));
  const [getSocket, setSocket] = useState<Socket>();

  const WebMatchmaking = url + '/matchmaking';

  const joinQueueHandler = () => {
    setIsSearching(true);
    pongGame.current?.joinQueue();
  };

  const leaveQueueHandler = () => {
    setIsSearching(false);
    pongGame.current?.leaveQueue();
  };

  const searchGame = () => {
    pongGame.current?.searchGame();
  };

  useEffect(() => {
    setSocket(io(WebMatchmaking, { extraHeaders: { Authorization: getToken() as string } }))
    pongGame.current?.setGame();
    setGame(pongGame);
    console.log("useEffect socket")
    // ... setup socket listeners
    return () => {
      // ... cleanup socket listeners
      getSocket?.disconnect();

    };
  }, []);

  useEffect(() => {
    searchGame();
  }, [pongGame]);

  return (
    <div className="matchmaking">
      <div className="main">
        <div className="logo">
          <img src={logo_matchmaking} alt="Logo du site" />
          <PongGame
            ref={pongGame}
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
