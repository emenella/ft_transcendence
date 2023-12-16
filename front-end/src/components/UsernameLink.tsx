import React from "react";
import { useNavigate } from "react-router-dom";
import "./UsernameLink.css"
import { User } from "../utils/backendInterface";

function UsernameLink({ user }: { user: User }) {
	const navigate = useNavigate();

	function profileNav() {
		navigate("/home/profile/" + user.id);
	}

	return (
		<div>
			<button onClick={profileNav} className="username_button">
				{user.username}
			</button>
		</div>
	);
}

export default UsernameLink;
