"use client";

import { useState } from "react";

import Login from "../_components/login";
import Register from "../_components/regiester";

const LoginTemplate = () => {
	const [currentView, setCurrentView] = useState("sign-in");

	return (
		<div className="w-full flex justify-start px-8 py-8">
			{currentView === "sign-in" ? (
				<Login setCurrentView={setCurrentView} />
			) : (
				<Register setCurrentView={setCurrentView} />
			)}
		</div>
	);
};

export default LoginTemplate;
