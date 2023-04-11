import React from 'react';
import SignUpButton from './button/SignUpButton';
import LoginButton from './button/LoginButton';
import LoginWithout42 from './button/LoginWithout42';
import { isNotConnected } from '../utils/interface';

class HeaderNotConnected extends React.Component<isNotConnected> {

    constructor(props: isNotConnected) {
        super(props);
    }

    render() {
        return (
            <div>
            <SignUpButton />
            <br />
            <LoginWithout42 login={this.props.login} />
        </div>);
    }
}

export default HeaderNotConnected;
