import React from "react";
import { firstConnexion } from '../../api/Login'

function SignUpButton() {
	const [url, setUrl] = React.useState<string>();
	React.useEffect(() => {
		const getUrl = async () => {
			const urltmp = await firstConnexion();
			setUrl(urltmp);
		};
		getUrl();
	}, []);

	return (
		<a href={url}>
			<button>Création d'un compte</button>
		</a>
	);
}

export default SignUpButton;
