import React from "react";
import { tokenFunction } from "../../utils/interface";
import { connexion } from "../../api/Login";

class LoginButton extends React.Component<tokenFunction> {
// 	const [url, setUrl] = React.useState<string>();
// 	React.useEffect(() => {
// 		const getUrl = async () => {
// 			const urltmp = await connexion();
// 			setUrl(urltmp);
// 		};
// 		getUrl();
// 	}, []);

	render() {
		return (
			// <a href={url}>
				<button>Connexion</button>
			// </a>
		);
	}
}

export default LoginButton;
