import React from 'react';
import NotConnected from './User_not_connected';
import Connected from './User_connected';
import Game from './Game';

interface User {
    status: boolean;
    playing: boolean;
}

function Body({ status, playing }: User) {

    // dev
    status = true;
    // playing = true;
    // end dev

    if (status && playing)
        return <Game />;
    else if (status)
        return <Connected />;
    else
        return <NotConnected />;
}

export default Body;
