import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen">
			<div className="lg:h-20 h-16 bg-white border-b-2 flex justify-center items-center">
				<Link
					className="text-4xl text-blue-600 font-extrabold mb-3 mt-3 font-sans"
					href="/home"
				>
					Quizzr
				</Link>
			</div>

			<div className="flex-grow flex justify-center items-start">
				{children}
			</div>
		</div>
	);
}
