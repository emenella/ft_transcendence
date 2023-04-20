import { toast } from "react-hot-toast";

export function duelConfirmed(link : string) {
    toast("Votre adversaire a accepté le duel.");
    // navigate("");
}

export function duelUnconfirmed() {
    toast("Votre adversaire a refusé le duel.");
}
