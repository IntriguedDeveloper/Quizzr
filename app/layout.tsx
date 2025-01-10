import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Quizzr",
	description: "Minimalist Quiz Website",
};
import "./globals.css";
import { UserContextProvider } from "./context/UserContext";
import { Suspense } from "react";
import Loading from "./loading";
import NextTopLoader from "nextjs-toploader";
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="h-screen w-screen">
				<NextTopLoader showSpinner={true}></NextTopLoader>
				<UserContextProvider>
					<Suspense fallback={<Loading></Loading>}>
						{children}
					</Suspense>
				</UserContextProvider>
			</body>
		</html>
	);
}
