import React from "react";
import "./Form.css";
import { saveQRCode } from "../../api/Auth";
import { QRCodeFormProps, QRCodeFormState } from "../../utils/interface";

class QRCodeForm extends React.Component<QRCodeFormProps, QRCodeFormState> {
	constructor(props: any) {
		super(props);
		this.state = {
			secret: "",
		};
		this.handleClick = this.handleClick.bind(this);
		this.setSecret = this.setSecret.bind(this);
	}

	async handleClick() {
		const token = await saveQRCode(this.state.secret, this.props.accessToken);
		if (token) {
			localStorage.setItem("token", token);
			this.props.navigate("/set-username");
		}
	}

	setSecret(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({ secret: e.target.value });
	}

	render() {
		return (
			<div className="parent">
				<p>Veuillez scanner ce QRCode avec votre application Google Authenticator.</p>
				<img src={this.props.qrcode} />
				<br />
				<div className="form">
					<label>Veuillez entrer votre code secret correspondant : <input type="text" onChange={this.setSecret} /> </label>
					<button onClick={this.handleClick}>Envoyer</button>
				</div>
			</div>
		);
	}
}

export default QRCodeForm;
