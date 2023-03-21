import React from "react";
import { firstConnexion } from '../../api/Auth'

function ConnectionButton() {
	const [url, setUrl] = React.useState<string>();
	React.useEffect(() => {
		const getUrl = async () => {
			const tmp = await firstConnexion();
			setUrl(tmp);
		};
		getUrl();
	}, []);

	return (
		<a href={url}>
			<button>Connexion</button>
		</a>
	);
}

export default ConnectionButton;
