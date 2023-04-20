import { toast } from "react-hot-toast";
import { User } from "./backend_interface";
import Emoji from "../components/Emoji";
import { acceptDuel, denyDuel } from "../api/User";
import { useNavigate } from "react-router-dom";

export function receiveDuel(sender: User) {
    const navigate = useNavigate();

    async function accept(id : number) {
        const req = await acceptDuel(id);
        if (req?.status === 200) {
            toast.success('Invitation acceptée.');
            navigate("");
        } else
            toast.error('Erreur. Veuillez réessayer.');
    }

    async function deny(id : number) {
        const req = await denyDuel(id);
        if (req?.status === 200) {
            toast.success('Invitation refusée.');
        } else
            toast.error('Erreur. Veuillez réessayer.');
    }

    toast((t) => (
        <span>
            <p>{sender.username} t'a invité à jouer !</p>
            <button onClick={() => { accept(sender.id); toast.dismiss(t.id); }}>
                Accepter <Emoji label="check_mark" symbol="✔️" />
            </button>
            <button onClick={() => { deny(sender.id); toast.dismiss(t.id); }}>
                Refuser <Emoji label="cross_mark" symbol="❌" />
            </button>
        </span>), {
        duration: 30000,
    });
}

export function duelConfirmed(link : string) {
    const navigate = useNavigate();

    toast("Votre adversaire a accepté le duel.");
    navigate("");
}

export function duelUnconfirmed() {
    toast("Votre adversaire a refusé le duel.");
}
