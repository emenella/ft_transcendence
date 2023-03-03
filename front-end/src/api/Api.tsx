import axios from 'axios'

const client = axios.create({
    baseURL: "https://localhost/"
});

export default client;
