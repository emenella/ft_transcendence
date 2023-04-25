import { inviteFriend, removeFriend, acceptFriend, denyFriend, addFromBlacklist, removeFromBlacklist } from "../api/User";
import { toast } from "react-hot-toast";

export function handleNotification(data: any) {
    if (data.ok == true) {
        toast.success(data.msg);
    } else {
        toast.error(data.msg);
    }
}

export function invite(username : string) {
    inviteFriend(username);
}

export function remove(username : string) {
    removeFriend(username);
}

export function accept(username : string) {
    acceptFriend(username);
}

export function deny(username : string) {
    denyFriend(username);
}

export function blacklist(username : string) {
    addFromBlacklist(username);
}

export function unblacklist(username : string) {
    removeFromBlacklist(username);
}
