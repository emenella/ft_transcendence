import { inviteFriend, removeFriend, acceptFriend, denyFriend } from "../api/User";
import { toast } from "react-hot-toast";

export async function invite(username : string) {
    const req = await inviteFriend(username);
    if (req?.status === 201)
        toast.success('Invitation envoyée.');
    else
        toast.error('Erreur. Veuillez réessayer.')
}

export async function remove(username : string) {
    const req = await removeFriend(username);
    if (req?.status === 201)
        toast.success('Ami supprimé.');
    else
        toast.error('Erreur. Veuillez réessayer.')
}

export async function accept(username : string) {
    const req = await acceptFriend(username);
    if (req?.status === 201)
        toast.success('Demande d\'ami acceptée.');
    else
        toast.error('Erreur.')
}

export async function deny(username : string) {
    const req = await denyFriend(username);
    if (req?.status === 201)
        toast.success('Demande d\'ami refusée.');
    else
        toast.error('Erreur.')
}
