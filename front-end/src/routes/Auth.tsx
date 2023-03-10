import React from "react";
import { useSearchParams } from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { getQRCode } from "../api/Auth";

function Auth() {
	const [searchParams] = useSearchParams();
	const access_token = searchParams.get('token');
	localStorage.setItem("token", JSON.stringify(access_token));

	const [qrcode, setQRCode] = React.useState<string>();
	React.useEffect(() => {
		const getQRCodeSrc = async () => {
			const tmp = await getQRCode();
			setQRCode(tmp);
		};
		getQRCodeSrc();
	}, []);

	return (
		<img src={qrcode} />
	);
}

// return <Navigate to="/" />;

export default Auth;
