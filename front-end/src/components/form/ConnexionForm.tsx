import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCode2FA } from "../../api/Auth";

interface ConnexionProps {
	acces_code: string;
	navigate: any;
}

class Connexion extends React.Component<ConnexionProps, {secret: string}> {
	state = {
		secret : '',
	}

	constructor(props: any) {
		super(props);
		this.setSecret = this.setSecret.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	async handleClick() {
        const token = await submitCode2FA(this.state.secret, this.props.acces_code);
		if (token)
		{
			localStorage.setItem("token", token);
			this.props.navigate("/");
		}
	}

	setSecret(e: ChangeEvent<HTMLInputElement>) : void {
		this.setState({ secret : e.target.value });
	}

	render() {
		return (
			<div>
				<label>Secret : <input type="text" onChange={this.setSecret} /> </label>
				<button onClick={this.handleClick}>Envoyer</button>
			</div>
		);
	}
}

function ConnexionWrap(props: any) {
	const navigate = useNavigate();

	return (<Connexion acces_code={props.acces_code} navigate={navigate} />);
}


export default Connexion;