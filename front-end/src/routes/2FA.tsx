import React from "react";
import { useSearchParams } from 'react-router-dom'
import { setToken } from "../api/Api";
import Connexion from "../components/form/ConnexionForm";

export default function DoubleFA() {
    const [searchParams] = useSearchParams();
	const access_token = searchParams.get('token');
    if(!access_token) {
        return (
            <div>
                <h1>Erreur</h1>
                <p>Vous n'avez pas accès à cette page</p>
            </div>
        );
    }
    return (
        <Connexion acces_code={access_token}></Connexion>
    );
};
