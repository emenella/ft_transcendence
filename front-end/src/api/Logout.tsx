import axios from '../api/Api';

export async function logOutApi() {
    try {
        await axios.post('/logout');
    }
    catch(e) {
        console.log(e);
    }
}
