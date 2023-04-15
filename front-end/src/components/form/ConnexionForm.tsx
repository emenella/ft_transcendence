import React, { ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./Form.css";
import { submitCode2FA } from "../../api/Auth";
import { ConnexionProps } from "../../utils/interface";

class Connexion extends React.Component<ConnexionProps, { secret: string }> {
	state = {
		secret: '',
	}

	constructor(props: any) {
		super(props);
		this.setSecret = this.setSecret.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	async handleClick() {
		const token = await submitCode2FA(this.state.secret, this.props.access_code);
		if (token) {
			localStorage.setItem("token", token);
			this.props.navigate("/");
		}
		else {
			toast.error('Erreur : veuillez réessayez.');
		}
	}

	setSecret(e: ChangeEvent<HTMLInputElement>): void {
		this.setState({ secret: e.target.value });
	}

	render() {
		return (
			<div className="parent">
				<Toaster />
				<div className="form">
					<label>Veuillez entrer votre code secret : <input type="text" onChange={this.setSecret} /> </label>
					<button onClick={this.handleClick}>Envoyer</button>
				</div>
			</div>
		);
	}
}

export default Connexion;
