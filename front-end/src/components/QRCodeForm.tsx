import React, { ChangeEvent } from "react";
import { saveQRCode } from "../api/Auth";

class QRCodeForm extends React.Component {
	state = {
		secret : ''
	}

	constructor(props: any) {
		super(props);
		this.setSecret = this.setSecret.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		saveQRCode(this.state.secret);
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

// return <Navigate to="/" />;

export default QRCodeForm;
