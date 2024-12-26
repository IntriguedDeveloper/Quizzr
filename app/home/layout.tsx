import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="flex justify-center items-center h-20">
				<h1 className="text-4xl text-blue-600 font-extrabold mb-5">
					Quizzr
				</h1>
			</div>
			{children}
		</>
	);
}
