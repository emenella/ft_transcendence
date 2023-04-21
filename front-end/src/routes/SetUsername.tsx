import React from "react";
import { useNavigate } from "react-router-dom"
import { getJwtCookie } from "../api/JwtCookie";
import UsernameForm from "../components/form/UsernameForm";

export default function SetUsername() {
    const navigate = useNavigate();
    const token = getJwtCookie();

    if (!token) {
        navigate("/error");
    }

    return (<UsernameForm navigate={navigate} />);
}