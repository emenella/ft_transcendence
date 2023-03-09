import React from 'react';
import SignUpButton from './button/SignUpButton';
import LoginButton from './button/LoginButton';
import LoginWithout42 from './button/LoginWithout42';
import { tokenFunction } from '../utils/interface';

class HeaderNotConnected extends React.Component<tokenFunction> {
    render() {
        return (
            <div>
            <LoginButton setToken={this.props.setToken} />
            <br />
            <SignUpButton />
            <br />
            <LoginWithout42 setToken={this.props.setToken} />
        </div>);
    }
}

export default HeaderNotConnected;
