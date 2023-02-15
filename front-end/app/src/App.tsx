import React, { useState } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

function App() {
    const [status, setStatus] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);

    return (
        <div>
            <Header status={status} />
            <Body status={status} playing={playing} />
            <Footer />
        </div>
    );
}

export default App;
