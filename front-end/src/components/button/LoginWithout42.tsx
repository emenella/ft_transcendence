import React from "react";
import { login } from '../../api/Auth'
import { tokenFunction } from "../../utils/interface";

function takeJWT() {
    const access_token = login(1);
    localStorage.setItem("user", JSON.stringify(access_token));
}

class LoginWithout42 extends React.Component<tokenFunction> {
    render() {
        return (
            <button onClick={() => { takeJWT(); this.props.setToken(); }}>Connexion sans 42</button>
        );
    }
}

export default LoginWithout42;
