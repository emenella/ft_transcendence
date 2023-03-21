import React, { ChangeEvent } from "react";
import { saveQRCode } from "../../api/Auth";
import { redirect } from "react-router-dom";

class QRCodeForm extends React.Component<{acces_token: string}> {
	state = {
		secret : '',
		acces_token: this.props.acces_token
	}

	constructor(props: any) {
		super(props);
		this.setSecret = this.setSecret.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		saveQRCode(this.state.secret, this.state.acces_token).then(() => {;
		redirect("/set-username");});
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

export default QRCodeForm;
