import axios from 'axios'

const client = axios.create({
    baseURL: "https://localhost/"
});

export function authHeader() {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.access_token) {
        return { 'x-access-token': user.access_token };
    } else {
        return {};
    }
}

export default client;
