import { client as axios } from './Api'

export async function deleteAccount() {
    try {
        await axios.delete('/api/users/{id}');
    }
    catch(e) {
        console.log(e);
    }
}
