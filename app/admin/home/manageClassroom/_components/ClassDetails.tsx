"use client";
import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import AddQuiz from "./AddQuiz";
import {
	ClassRoomContextType,
	useClassRoomContext,
} from "@/app/admin/context/ClassRoomContext";

export default function ClassDetails() {
	const userData = useUserContext();
	const classData = useClassRoomContext();
	const [classDetailsDropDownToggle, setClassDetailsDropDownToggle] =
		useState(false);

	const formatKey = (key: string) => {
		return key.replace(/([a-z])([A-Z])/g, "$1 $2");
	};

	return (
		<div className="h-full w-screen flex justify-start lg:items-center flex-col">
			<div
				className="lg:w-5/6 w-full p-2 bg-blue-400 lg:rounded-lg flex flex-col items-center justify-center mt-2 text-2xl cursor-pointer"
				onClick={() => {
					setClassDetailsDropDownToggle(!classDetailsDropDownToggle);
				}}
			>
				<div className="flex items-center">
					Class Details
					<FaCaretDown
						size={30}
						className={`ml-4 text-slate-100 transition-transform duration-300 ${
							classDetailsDropDownToggle ? "rotate-180" : "rotate-0"
						}`}
					/>
				</div>

				<div
					className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
						classDetailsDropDownToggle
							? "max-h-96 opacity-100"
							: "max-h-0 opacity-0"
					} bg-white w-full rounded-md mt-2`}
				>
					{classData ? (
						<div className="p-4 text-gray-800 text-lg">
							{Object.entries(classData).map(([key, value]) => (
								<div key={key} className="mb-2">
									<strong className="capitalize">{formatKey(key)}:</strong>{" "}
									{String(value)}
								</div>
							))}
						</div>
					) : (
						<div className="p-4 text-gray-500">Loading class details...</div>
					)}
				</div>
			</div>
			<AddQuiz></AddQuiz>
		</div>
	);
}
