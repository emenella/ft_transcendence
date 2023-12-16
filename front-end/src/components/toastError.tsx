import toast from "react-hot-toast";
import { AxiosError } from "axios";

export function toastError(error: AxiosError) {
	interface errorData {
		message: string;
		statusCode: number;
	}

	const data = error.response?.data as errorData;
	toast.error("Error: " + data.message);
}
