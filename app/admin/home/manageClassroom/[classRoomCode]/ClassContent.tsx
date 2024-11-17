"use client";

import { useEffect, useState } from "react";
import {
	ClassRoomContextType,
	fetchClassDetails,
} from "./_utils/fetchClassDetails";
import { useUserContext } from "@/app/context/UserContext";

export default function ClassContent({ classCode }: { classCode: string }) {
	const [classDetails, setClassDetails] = useState<ClassRoomContextType | null>(
		null
	);
	const teacherDetails = useUserContext();

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const details = await fetchClassDetails(classCode, teacherDetails);
				setClassDetails(details);
			} catch (error) {
				console.error("Error fetching class details:", error);
			}
		};

		if (classCode) {
			fetchDetails();
		}
	}, [classCode, teacherDetails]);

	return (
		<div className="w-full lg:w-5/6 bg-white h-[95%] mt-2 flex flex-col items-center justify-start p-2 rounded-lg shadow-3d border-gray-400 border-2 m-2">
			<h1 className="text-3xl text-blue-600 font-extrabold font-sans underline">
				{classDetails?.className}
			</h1>
			<div className="mt-2">
				<h1 className= "text-xl text-blue-600 font-semibold font-mono">Active Quizzes</h1>
				
			</div>
		</div>
	);
}
