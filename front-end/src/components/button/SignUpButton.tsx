import React from "react";

function ConnectionButton({ url }: { url: string }) {
	
	return (
		<a href={url}>
			<button>Connexion</button>
		</a>
	);
}

export default ConnectionButton;
