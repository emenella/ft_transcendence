import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getQRCode } from "../api/Auth";
import { setToken } from "../api/Api";
import { getMe } from "../api/User";

function Auth() {
	const [searchParams] = useSearchParams();
	const access_token = searchParams.get('token');
	const navigate = useNavigate();

	React.useEffect(() => {
		if (access_token) {
			setToken(access_token);
			getMe().then((user) => {
				if (user.username == null) {
					navigate('/set-username');
				}
			});
			navigate('/');
		}
	}, []);

	return ( <h1>Wait a moment...</h1>);
}

export default Auth;
