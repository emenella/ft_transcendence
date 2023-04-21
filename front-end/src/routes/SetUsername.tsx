import React from "react";
import { useNavigate } from "react-router-dom"
import { getToken } from "../api/Api";
import UsernameForm from "../components/form/UsernameForm";

export default function SetUsername() {
    const navigate = useNavigate();
    const token = getToken();

    if (!token) {
        navigate("/error");
    }

    return (<UsernameForm navigate={navigate} />);
}