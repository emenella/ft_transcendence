import React from "react";
import { Link } from "react-router-dom";
import { User } from "../utils/backend_interface";

function UsernameLink(props: { user : User }) {
    const linkStyle = {
        color: "black",
    }

    return(
        <div>
            <Link to={"/profil/" + props.user.id} style={linkStyle}>{props.user.username}</Link>
        </div>
    );
}

export default UsernameLink;
