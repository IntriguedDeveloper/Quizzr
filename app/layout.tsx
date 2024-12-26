import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Quizzr",
	description: "Quizzr Admin",
};
import "./globals.css";
import { UserContextProvider } from "./context/UserContext";


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="h-screen w-screen">
				<UserContextProvider>
					{children}
				</UserContextProvider>
			</body>
		</html>
	);
}
