import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from '../assets/black_logo.png';
import HeaderConnected from './Header_connected';
import HeaderNotConnected from './Header_not_connected';
import './Header.css';

function Header() {
    return (
        <div className='flex-container'>
            <div> <img src={logo} alt='Logo du site' /> </div>
            <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route path="/headerconnected" element={<HeaderConnected />} />
                        <Route path="/headernotconnected" element={<HeaderNotConnected />} />
                    </Routes>
                </BrowserRouter>
            </div>
         </div>
    );
}

export default Header;
