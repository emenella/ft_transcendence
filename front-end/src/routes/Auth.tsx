import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getQRCode } from "../api/Auth";
import QRCodeForm from "../components/form/QRCodeForm";

function Auth() {
	const [searchParams] = useSearchParams();
	const access_token = searchParams.get('token');
	const [qrcode, setQRCode] = React.useState<string>();
	const navigate = useNavigate();

	React.useEffect(() => {
		const getQRCodeSrc = async () => {
			const tmp = await getQRCode(access_token);
			setQRCode(tmp);
		};
		getQRCodeSrc();
	}, []);

	if (!access_token) {
		navigate("/error");
	}

	return ( <QRCodeForm qrcode={qrcode as string} accessToken={access_token as string} navigate={navigate} /> );
}

export default Auth;
