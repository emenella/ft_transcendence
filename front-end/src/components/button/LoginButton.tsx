import React from "react";
import { tokenFunction } from "../../utils/interface";
import { connexion } from "../../api/Auth";

class LoginButton extends React.Component<tokenFunction> {
	render() {
		return (
			// <a href={url}>
				<button>Connexion</button>
			// </a>
		);
	}
}

export default LoginButton;
