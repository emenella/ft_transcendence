import axios from '../api/Api';

// try catch
export async function connexion() {
    try {
        const req = await axios.post('/auth/2fa/login');
        return req.data;
    }
    catch(e) {
        console.log(e);
    }
}

// try catch
export async function firstConnexion() {
    try {
        const req = await axios.post('/auth');
        return req.data;
    }
    catch(e) {
        console.log(e);
    }
}

// try catch
export async function logOutApi() {
    try {
        await axios.post('/logout');
    }
    catch(e) {
        console.log(e);
    }
}
