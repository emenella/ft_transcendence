import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Auth from "./routes/Auth";
import { Activate2FA, Connection } from "./routes/2FA";
import SetUsername from "./routes/SetUsername";
import { Error } from "./components/Error";

const root = createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/home/*" element={<App />} />
			<Route path="/auth" element={<Auth />} />
			<Route path="/2fa" element={<Activate2FA />} />
			<Route path="/secret" element={<Connection />} />
			<Route path="/set-username" element={<SetUsername />} />
			<Route path="/error" element={<Error />} />
			<Route path="*" element={<Navigate to="/home" replace />} />
		</Routes>
	</BrowserRouter>
);
