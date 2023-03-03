import React from 'react';
import './App.css'
import logo from './assets/black_logo.png';
import Footer from './components/Footer';
import HeaderConnected from './components/Header_connected';
import HeaderNotConnected from './components/Header_not_connected';
import BodyNotConnected from './components/Body_not_connected';
import BodyConnected from './components/Body_connected';

function App() {
    let isConnected = false;
    // isConnected = true;

    if (isConnected)
        return (
            <div>
                <div className='flex-container'>
                    <div> <img src={logo} alt='Logo du site' /> </div>
                    <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
                    <div> <HeaderConnected /> </div>
                </div>
                <BodyConnected />
                <Footer />
            </div>
        );
    else
        return (
            <div>
                <div className='flex-container'>
                    <div> <img src={logo} alt='Logo du site' /> </div>
                    <div> <h1>Le meilleur jeu de pong de tout 42</h1> </div>
                    <div> <HeaderNotConnected /> </div>
                </div>
                <BodyNotConnected />
                <Footer />
            </div>
        );
}

export default App;
