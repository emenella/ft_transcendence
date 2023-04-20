import { toast } from "react-hot-toast";
import { User } from "./backend_interface";
import Emoji from "../components/Emoji";
import { acceptDuel, denyDuel } from "../api/User";

export function receiveDuel(sender: User) {
    async function accept(id : number) {
        const req = await acceptDuel(id);
        if (req?.status === 200) {
            {/* add redirection */}
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
        duration: 10000,
    });
}
