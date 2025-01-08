"use client";
import { useUserContext } from "@/app/context/UserContext";
import Navbar from "../_components/Navbar";

import { useState } from "react";
import Footer from "../_components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
	const teacherData = useUserContext();

	return (
		<>
			<div className="flex flex-col h-screen">
				<Navbar teacherDetails={teacherData} />

				<div className="h-full w-full flex flex-row items-start justify-center p-0 overflow-y-auto">
					{children}
				</div>
			</div>
		</>
	);
}
