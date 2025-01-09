import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Quizzr",
	description: "Minimalist Quiz Website",
};
import "./globals.css";
import { UserContextProvider } from "./context/UserContext";
import { Suspense } from "react";
import Loading from "./loading";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="h-screen w-screen">
				<UserContextProvider>
					<Suspense fallback={<Loading></Loading>}>
						{children}
					</Suspense>
				</UserContextProvider>
			</body>
		</html>
	);
}
