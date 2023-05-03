import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./auth/Login";
import { Enable2FA, Login2FA } from "./auth/2FA";
import { Error } from "./components/Error";
import "./index.css"

const root = createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/home/*" element={<App />} />
			<Route path="/login" element={<Login />} />
			<Route path="/login2fa" element={<Login2FA />} />
			<Route path="/error" element={<Error />} />
			<Route path="*" element={<Navigate to="/home" replace />} />
		</Routes>
	</BrowserRouter>
);
