import React from "react";
import { login } from '../../api/Auth'
import { isNotConnected } from "../../utils/interface";

class LoginWithout42 extends React.Component<isNotConnected> {
    constructor(props: isNotConnected) {
        super(props);
    }

    async takeJWT() {
        const access_token = await login(2);
        this.props.login(access_token);
    }

    render() {
        return (
            <button onClick={() => { this.takeJWT(); }}>Connexion sans 42</button>
        );
    }
}

export default LoginWithout42;
