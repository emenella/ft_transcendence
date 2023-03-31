import React from "react";
import { Link } from "react-router-dom";
import { isNotConnected } from "../../utils/interface";

class LoginButton extends React.Component<isNotConnected> {
	render() {
		return (
			<Link to="/connexion">Connexion</Link>
		);
	}
}

export default LoginButton;
