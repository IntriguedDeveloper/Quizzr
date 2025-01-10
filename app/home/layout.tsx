"use client";
import Link from "next/link";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen">
			<div className="h-20 bg-white border-b-2 flex justify-center items-center">
				<Link
					className="text-4xl text-blue-600 font-extrabold mb-3 mt-3"
					href="/home"
				>
					Quizzr
				</Link>
			</div>
			<ProgressBar
				height="4px"
				color="#fffd00"
				options={{ showSpinner: false }}
				shallowRouting
			/>
			<div className="flex-grow flex justify-center items-start">
				{children}
			</div>
		</div>
	);
}
