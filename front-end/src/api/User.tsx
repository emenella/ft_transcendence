import { client as axios, authHeader } from './Api'

export async function getMe() {
    try {
        const res = await axios.get('api/users/me', { headers: authHeader() });
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function setUsername(username: string) {
    try {
        return await axios.post('api/users/me', { username: username }, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        return await axios.post('api/users/upload/avatar', formData, { headers: authHeader('multipart/form-data') });
    }
    catch (e) {
        console.log(e);
    }
}

export async function delete2FA() {
    try {
        await axios.delete('api/auth/2fa/delete', { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function getUserById(id: number) {
    try {
        const res = await axios.get('api/users/id/?id=' + id, { headers: authHeader() });
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function getMatchs(id: number) {
    try {
        const res = await axios.get('api/users/match_history/?id=' + id, { headers: authHeader() });
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function inviteFriend(username : string) {
    try {
        return await axios.post('api/users/friends/invite?username=' + username, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function removeFriend(username : string) {
    try {
        return await axios.delete('api/users/friends/remove?username=' + username, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function acceptFriend(username : string) {
    try {
        return await axios.post('api/users/friends/accept?username=' + username, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function denyFriend(username : string) {
    try {
        return await axios.delete('api/users/friends/deny?username=' + username, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function addToBlacklist(username : string) {
    try {
        return await axios.delete('api/users/blacklist/add?username=' + username, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function removeFromBlacklist(username : string) {
    try {
        return await axios.delete('api/users/blacklist/remove?username=' + username, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}
