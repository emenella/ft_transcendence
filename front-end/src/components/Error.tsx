import './Error.css';
import toast from 'react-hot-toast';
import  { AxiosError } from 'axios';

export function toastError(error: AxiosError) {

	interface errorData {
		message: string;
		statusCode: number;
	}

	const data = error.response?.data as errorData;
	console.log(error);
	toast.error('Erreur: ' + data.message);
}

export function Error() {
    return (
        <div>
            <p>Oups, on dirait qu'on a un soucis par ici...</p>
        </div>
    );
}
