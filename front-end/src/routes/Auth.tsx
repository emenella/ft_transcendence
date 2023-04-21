import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { setJwtCookie } from "../api/JwtCookie";
import { getMe } from "../api/User";
import { UserStatus } from "../utils/backend_interface";

function Auth() {
	const [searchParams] = useSearchParams();
	const access_token = searchParams.get("token");
	const navigate = useNavigate();
	
	React.useEffect(() => {
		if (access_token) {
			setJwtCookie(access_token);
			getMe().then((user) => {
				if (user.username == null) {
					navigate("/set-username");
				}
			});
			navigate("/");
		}
	}, [access_token, navigate]);

	return (<h1>Wait a moment...</h1>);
}

export default Auth;