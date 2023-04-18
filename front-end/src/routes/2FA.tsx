import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom'
import Connexion from "../components/form/ConnexionForm";
import QRCodeForm from "../components/form/QRCodeForm";
import { getQRCode } from "../api/Auth";
import { getToken } from "../api/Api";

export function Connection() {
    const [searchParams] = useSearchParams();
    const access_token = searchParams.get('token');
    const navigate = useNavigate();

    if (!access_token) {
        return (
            <div>
                <h1>Erreur</h1>
                <p>Vous n'avez pas accès à cette page</p>
            </div>
        );
    }
    
    return (
        <Connexion access_code={access_token} navigate={navigate} />
    );
};

export function Activate2FA() {
	const access_token = getToken();
	const [qrcode, setQRCode] = React.useState<string>();
	const navigate = useNavigate();

	React.useEffect(() => {
		const getQRCodeSrc = async () => {
            const tmp = await getQRCode(access_token);
			setQRCode(tmp);
		};
		getQRCodeSrc();
	});
    
    if (!access_token) {
        navigate("/error");
    }

	return ( <QRCodeForm qrcode={qrcode as string} accessToken={access_token as string} navigate={navigate} /> );
}