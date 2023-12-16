import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { setJwtCookie } from "../../api/Auth";
import { getMe } from "../../api/User.requests";
import { removeJwtCookie } from "../../api/Auth";

function Login() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();

	React.useEffect(() => {
		if (token) {
			setJwtCookie(token);
			getMe().then((user) => {
				if (!user) {
					removeJwtCookie();
					navigate("/error");
				}
				else if (!(user.isProfileComplete))
					navigate("/signup");
				else if (user.is2FAActivated) {
					removeJwtCookie();
					navigate("/error");
				}
			});

			navigate("/home");
		}
		else
			navigate("/error");
		}, [token, navigate]);

	return (<h1>Connexion en cours ...</h1>);
}

export default Login;
