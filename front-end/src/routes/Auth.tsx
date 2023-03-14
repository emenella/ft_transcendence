import React from "react";
import { useSearchParams } from 'react-router-dom'
import { setToken } from "../api/Api";
import { getQRCode } from "../api/Auth";
import QRCodeForm from "../components/QRCodeForm";

function Auth() {
	const [searchParams] = useSearchParams();
	const access_token = searchParams.get('token');
	if(access_token)
		setToken(access_token);

	const [qrcode, setQRCode] = React.useState<string>();
	React.useEffect(() => {
		const getQRCodeSrc = async () => {
			const tmp = await getQRCode();
			setQRCode(tmp);
		};
		getQRCodeSrc();
	}, []);

	return (
		<div>
			<img src={qrcode} />
			<QRCodeForm />
		</div>
	);
}

export default Auth;
