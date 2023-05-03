import React from "react";
import "./Body_not_connected.css";
import logo from "../../assets/white_logo.png";
import emenella from "../../assets/emenella.jpg";
import ebellon from "../../assets/ebellon.jpg";
import pthomas from "../../assets/pthomas.jpg";
import mberne from "../../assets/mberne.jpg";

function BodyNotConnected() {
	return (
		<div className="notconnected">
			<h2>
				Bienvenue sur le pong codé par vos plus dévoués développeurs.
			</h2>
			<img src={logo} alt="Logo du site" />
			<h4>Venez vous mesurer aux meilleurs joueurs de tout 42Lyon !</h4>
			<p>
				Pour ça rien de plus simple : créez-vous un compte ou connectez-vous,
				puis lancez votre partie.
			</p>
			<h4>Comment jouer ?</h4>
			<p>
				Rien de compliqué : si vous voulez monter la barre, appuyez sur w et
                si vous voulez la descendre, appuyez sur s.
			</p>
			<h4>Amusez-vous bien !</h4>
            <br />
            <div className="flexbox">
                <div>
                    <h4>Erwan Menella</h4>
                    <img src={emenella} alt="Erwan" className="profilPhoto" />
                    <p><strong>Crypto Boy</strong>.</p>
                </div>
                <div>
                    <h4>Pablo Lamtenzan</h4>
                    <img src={ebellon} alt="Emil" className="profilPhoto" />
                    <p><strong>RPL_WHOISUSER</strong> ebellon.</p>
                </div>
                <div>
                    <h4>Emil Ebellon</h4>
                    <img src={ebellon} alt="Emil" className="profilPhoto" />
                    <p><strong>RPL_WHOISUSER</strong> ebellon.</p>
                </div>
                <div>
                    <h4>Nathan Lecaille</h4>
                    <img src={pthomas} alt="Pierre" className="profilPhoto" />
                    <p>Spécialiste des <strong>caissons métalliques parallélépipédiques</strong>.</p>
                </div>
            </div>
		</div>
	);
}

export default BodyNotConnected;
