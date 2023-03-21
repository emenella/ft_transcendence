import React, { ChangeEvent } from "react";
import { setUsername } from "../../api/User";
import { redirect } from "react-router-dom";

class UsernameForm extends React.Component {
	state = {
		username : ''
	}

	constructor(props: any) {
		super(props);
		this.setUsername = this.setUsername.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		setUsername(this.state.username);
		redirect("/");
	}

	setUsername(e: ChangeEvent<HTMLInputElement>) : void {
		this.setState({ username : e.target.value });
	}

	render() {
		return (
			<div>
				<label>Pseudo : <input type="text" onChange={this.setUsername} /> </label>
				<button onClick={this.handleClick}>Envoyer</button>
			</div>
		);
	}
}

export default UsernameForm;
