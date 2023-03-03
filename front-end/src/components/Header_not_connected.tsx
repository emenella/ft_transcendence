import React from 'react';
import SignUpButton from './button/SignUpButton';
import LoginButton from './button/LoginButton';
import LoginWithout42 from './button/LoginWithout42';

function HeaderNotConnected() {
    return (
        <div>
            <LoginButton />
            <br />
            <SignUpButton />
            <br />
            <LoginWithout42 />
        </div>
    );
}

export default HeaderNotConnected;
