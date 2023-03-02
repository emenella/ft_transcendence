import axios from 'axios'

const client = axios.create({
    baseURL: "https://http://localhost:3000/"
});

export default client;
