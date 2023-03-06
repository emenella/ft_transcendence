import React from "react";
import { firstConnexion } from '../../api/Login'
import { tokenFunction } from "../../utils/interface";

class SignUpButton extends React.Component<tokenFunction> {
	// const [url, setUrl] = React.useState<string>();
	// React.useEffect(() => {
	// 	const getUrl = async () => {
	// 		const urltmp = await firstConnexion();
	// 		setUrl(urltmp);
	// 	};
	// 	getUrl();
	// }, []);

	render() {
		return (
			// <a href={url}>
				<button>Création d'un compte</button>
			// </a>
		);
	}
}

export default SignUpButton;
