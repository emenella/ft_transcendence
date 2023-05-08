import React from "react";
import "./Body_not_connected.css";
import logo from "../../assets/white_logo.png";
import emenella from "../../assets/emenella.jpg";
import ebellon from "../../assets/ebellon.jpg";
import pthomas from "../../assets/pthomas.jpg";
import mberne from "../../assets/mberne.jpg";

function BodyNotConnected() {
	return (
		<div className="text-center bg-DAF0EE pt-10 pb-10">
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
            <div className="flexbox flex-wrap justify-center gap-x-20">
                <div className="w-1/4">
                    <h4>Erwan Menella</h4>
                    <img src={emenella} alt="Erwan" className="rounded-full w-52" />
                    <p><strong>Crypto Boy</strong>.</p>
                </div>
                <div className="w-1/4">
                    <h4>Pablo Lamtenzan</h4>
                    <img src={ebellon} alt="Emil" className="rounded-full w-52" />
                    <p><strong>RPL_WHOISUSER</strong> ebellon.</p>
                </div>
                <div className="w-1/4">
                    <h4>Emil Ebellon</h4>
                    <img src={ebellon} alt="Emil" className="rounded-full w-52" />
                    <p><strong>RPL_WHOISUSER</strong> ebellon.</p>
                </div>
                <div className="w-1/4">
                    <h4>Nathan Lecaille</h4>
                    <img src={pthomas} alt="Pierre" className="rounded-full w-52" />
                    <p>Spécialiste des <strong>caissons métalliques parallélépipédiques</strong>.</p>
                </div>
            </div>
		</div>
	);
}

export default BodyNotConnected;
