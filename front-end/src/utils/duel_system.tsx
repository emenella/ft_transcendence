import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export function duelConfirmed(link : string) {
    toast("Votre adversaire a accepté le duel.");
    navigate("/home");
}

export function duelUnconfirmed() {
    toast("Votre adversaire a refusé le duel.");
}
