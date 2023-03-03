import React from "react";
import { login } from '../../api/Login'

function LoginWithout42() {
    function takeJWT() {
        const access_token = login(1);
        localStorage.setItem("user", JSON.stringify(access_token));
    }

	return (
		<button onClick={takeJWT}>Connexion sans 42</button>
	);
}

export default LoginWithout42;