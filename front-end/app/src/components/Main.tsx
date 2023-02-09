import React from 'react';
import './Main.css';
import NotConnected from './User_not_connected';
import Connected from './User_connected';

function Main() {
  return (
    <div className='Body'>
      <NotConnected />
      <Connected />
    </div>
  );
}

export default Main;
