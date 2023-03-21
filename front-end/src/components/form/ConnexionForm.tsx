import React, { ChangeEvent, useState } from "react";
import { submitCode2FA } from "../../api/Auth";
import { redirect } from "react-router-dom";

class Connexion extends React.Component<{acces_code: string}> {
	state = {
		secret : '',
		acces_code: this.props.acces_code
	}

	constructor(props: any) {
		super(props);
		this.setSecret = this.setSecret.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
        submitCode2FA(this.state.secret, this.state.acces_code).then(() => {;
		redirect("/"); });
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

export default Connexion;
