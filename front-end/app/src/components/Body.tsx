import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotConnected from './User_not_connected';
import Connected from './User_connected';

function Body() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/connected" element={<Connected />} />
                    <Route path="/notconnected" element={<NotConnected />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Body;
