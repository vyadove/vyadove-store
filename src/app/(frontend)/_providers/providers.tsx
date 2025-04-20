"use client";

import { AuthProvider } from "@/app/(frontend)/_providers/auth";
import { CartProvider } from "react-use-cart";

export const Providers: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<AuthProvider>
			<CartProvider>{children}</CartProvider>
		</AuthProvider>
	);
};
