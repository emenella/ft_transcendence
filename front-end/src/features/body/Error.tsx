import { useNavigate } from "react-router-dom";
import "./Error.css";
import Emoji from "../../components/Emoji";
import { removeJwtCookie } from "../../api/Auth";

function Error() {
	const navigate = useNavigate();

	function homeNav() {
		navigate("/home");
	}
	
	function logout() {
		removeJwtCookie();
		navigate("/home");
	}

	return (
		<div className="error">
			<h2>Vous ne devriez pas rester là !</h2>
			<button onClick={homeNav}>
				<Emoji label="rocket" symbol="🚀" /> Retournez en orbite
			</button>
			<br/>
			<button onClick={logout}>Déconnexion</button>
			<h2>Sinon vous allez vous faire absorber...</h2>
		</div>
	);
}

export default Error;
