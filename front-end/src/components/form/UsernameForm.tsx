import React, { ChangeEvent } from "react";
import "./Form.css";
import { setUsername } from "../../api/User";
import { UsernameFormProps, UsernameFormState } from "../../utils/interface";

class UsernameForm extends React.Component<UsernameFormProps, UsernameFormState> {
	state = {
		username: ''
	}

	constructor(props: any) {
		super(props);
		this.setUsername = this.setUsername.bind(this);
		this.handleClick = this.handleClick.bind(this);

	}

	async handleClick() {
		const req = await setUsername(this.state.username);
		if (req?.status === 201) {
			this.props.navigate("/");
		}
	}

	setUsername(e: ChangeEvent<HTMLInputElement>): void {
		this.setState({ username: e.target.value });
	}

	render() {
		return (
			<div className="parent">
				<div className="form">
					<label>Veuillez vous choisir un pseudo : <input type="text" onChange={this.setUsername} /> </label>
					<button onClick={this.handleClick}>Envoyer</button>
				</div>
			</div>
		);
	}
}

export default UsernameForm;
