import React from 'react';
import SignUpButton from './button/SignUp';
import LoginButton from './button/Login';

function HeaderNotConnected() {
    return (
        <div>
            <LoginButton />
            <br />
            <SignUpButton />
        </div>
    );
}

export default HeaderNotConnected;
