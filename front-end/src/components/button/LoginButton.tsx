import React from "react";
import { Link } from "react-router-dom";
import { tokenFunction } from "../../utils/interface";

class LoginButton extends React.Component<tokenFunction> {
	render() {
		return (
			<Link to="/connexion">Connexion</Link>
		);
	}
}

export default LoginButton;
