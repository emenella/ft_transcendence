import React from "react";
import { useSearchParams } from 'react-router-dom'
import { setToken } from "../api/Api";
import { getQRCode } from "../api/Auth";
import QRCodeForm from "../components/form/QRCodeForm";

function Auth() {
	const [searchParams] = useSearchParams();
	const access_token = searchParams.get('token');
	const [qrcode, setQRCode] = React.useState<string>();
	React.useEffect(() => {
		const getQRCodeSrc = async () => {
			const tmp = await getQRCode(access_token);
			setQRCode(tmp);
		};
		getQRCodeSrc();
	}, []);
	
	if(!access_token) {
		return (
			<div>
				<h1>Erreur</h1>
				<p>Vous n'avez pas accès à cette page</p>
			</div>
		);
	}


	return (
		<div>
			<img src={qrcode} />
			<QRCodeForm acces_token={access_token} />
		</div>
	);
}

export default Auth;
