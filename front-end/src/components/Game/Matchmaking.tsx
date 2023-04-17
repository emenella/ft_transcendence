import React, { useState } from 'react';
import './Matchmaking.css';
import SearchButton from './button/SearchMatch';
import LeaveButton from './button/Leave';
import PongGame from './PongGame';
import { getToken } from '../../api/Api';
import { User } from '../../utils/backend_interface';

const Matchmaking = ({user} : {user: User} ) => {
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
            token={getToken() as string}
            isQueue={isSearching}
            spec={null}
            user={user}
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
