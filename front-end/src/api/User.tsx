import { client as axios, authHeader } from './Api'

export async function getMe() {
    try {
        const res = await axios.get('/api/users/me', { headers: authHeader() });
        return res.data;
    }
    catch(e) {
        console.log(e);
    }
}

export async function setUsername(username: string) {
    try {
        await axios.post('api/users/me', { username: username }, { headers: authHeader() });
    }
    catch(e) {
        console.log(e);
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        await axios.post('api/users/upload/avatar', formData, { headers: authHeader() });
    }
    catch(e) {
        console.log(e);
    }
}

export async function deleteAccount(id: number) {
    try {
        await axios.delete('/api/users/' + id, { headers: authHeader() });
    }
    catch(e) {
        console.log(e);
    }
}

export async function delete2FA() {
    try {
        await axios.delete('api/auth/2fa/delete', { headers: authHeader() });
    }
    catch(e) {
        console.log(e);
    }
}