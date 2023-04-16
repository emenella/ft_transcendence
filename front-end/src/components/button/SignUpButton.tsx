import React from "react";
import { firstConnexion } from '../../api/Auth'

function ConnectionButton({ url }: { url: string }) {
	
	return (
		<a href={url}>
			<button>Connexion</button>
		</a>
	);
}

export default ConnectionButton;
