import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";
import Auth from "./routes/Auth";
import Spectate from "./routes/Spec";
import { Activate2FA, Connection } from "./routes/2FA";
import SetUsername from "./routes/SetUsername";
import { Error } from "./components/Error";

const root = createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<App />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/2fa" element={<Activate2FA />} />
				<Route path="/secret" element={<Connection />} />
				<Route path="/set-username" element={<SetUsername />} />
				<Route path="/spec/:spec" element={<Spectate />} />
				<Route path="/error" element={<Error />} />
			</Routes>
		</BrowserRouter>
);
