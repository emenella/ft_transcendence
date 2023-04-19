import { User } from '../utils/backend_interface';
import { client as axios, authHeader } from './Api'
import  { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { toastError } from '../components/Error';

export async function getMe(): Promise<any> {
    try {
        const res = await axios.get<User>('api/users/me', { headers: authHeader() });
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function changeUsername(username: string) {
    try {
        const req = await axios.post('api/users/me', { username: username }, { headers: authHeader() });
        toast.success('Pseudo enregistré.');
        return req;
    }
    catch (e) {
        toastError(e as AxiosError);
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        const req = await axios.post('api/users/avatar/upload', formData, { headers: authHeader('multipart/form-data') });
        toast.success('Image enregistrée.');
        return req;
    }
    catch (e) {
        toastError(e as AxiosError);
    }
}

export async function delete2FA() {
    try {
        return await axios.delete('api/auth/2fa/delete', { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function getUserById(id: number) {
    try {
        const res = await axios.get<User>('api/users/id/?id=' + id, { headers: authHeader() });
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function getUserByUsername(username: string) {
    try {
        const res = await axios.get('api/users/username/?username=' + username, { headers: authHeader() });
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function getMatchs(id: number) {
    try {
        const res = await axios.get('api/users/match_history/?id=' + id, { headers: authHeader() });
        console.log(res.data);
        return res.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function inviteFriend(username : string) {
    try {
        return await axios.post('api/users/friends/invite', { username: username }, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function removeFriend(username : string) {
    try {
        return await axios.delete('api/users/friends/remove', { headers: authHeader(), data : { username: username } });
    }
    catch (e) {
        console.log(e);
    }
}

export async function acceptFriend(username : string) {
    try {
        return await axios.post('api/users/friends/accept', { username: username }, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function denyFriend(username : string) {
    try {
        return await axios.delete('api/users/friends/deny', { headers: authHeader(), data : { username: username } });
    }
    catch (e) {
        console.log(e);
    }
}

export async function addFromBlacklist(username : string) {
    try {
        return await axios.post('api/users/blacklist/add', { username: username }, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function removeFromBlacklist(username : string) {
    try {
        return await axios.delete('api/users/blacklist/remove', { headers: authHeader(), data : { username: username } });
    }
    catch (e) {
        console.log(e);
    }
}

export async function changeUserStatus(status : number) {
    try {
        return await axios.post('api/users/status/?status=' + status, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}

export async function changeColorPaddle(color: string) {
    try {
        return await axios.post('api/users/?', { color: color }, { headers: authHeader() });
    }
    catch (e) {
        console.log(e);
    }
}
