import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { setJwtCookie } from "../api/JwtCookie";
import { getMe } from "../api/User";

function Login() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();
	
	React.useEffect(() => {
		if (token) {
			setJwtCookie(token);
			getMe().then((user) => {
				if (user.username == null) {
					navigate("/signUp");
				}
			});
		}
		navigate("/home");
	}, [token, navigate]);

	return (<h1>Wait a moment...</h1>);
}

export default Login;
