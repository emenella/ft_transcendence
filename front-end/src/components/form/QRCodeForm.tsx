import React from "react";
import { saveQRCode } from "../../api/Auth";
import { useNavigate } from "react-router-dom";


interface QRCodeFormProps {
	accessToken: string;
	navigate: any;
}

interface QRCodeFormState {
	secret: string;
}

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
			<div>
				<label>
					Secret :{" "}
					<input type="text" onChange={this.setSecret} />
				</label>
				<button onClick={this.handleClick}>Envoyer</button>
			</div>
		);
	}
}

export default QRCodeForm;
