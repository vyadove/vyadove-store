import { Toaster } from "@medusajs/ui";
import AccountLayout from "../../_templates/account-layout";

export default function AccountPageLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<AccountLayout>
			{children}
			<Toaster />
		</AccountLayout>
	);
}
