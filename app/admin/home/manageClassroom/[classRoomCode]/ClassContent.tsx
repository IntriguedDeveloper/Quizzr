"use client";

import { useEffect, useState } from "react";
import {
	ClassRoomContextType,
	fetchClassDetails,
} from "./_utils/fetchClassDetails";
import { useUserContext } from "@/app/context/UserContext";
import useSWR from "swr";
import { fetchActiveQuizzes } from "./_utils/fetchActiveQuizzes";
import QuizDetailsCard from "./_components/QuizDetailsCard";
import Loading from "./loading";
import { useQuizDetails } from "./_hooks/useQuizDetails";

export default function ClassContent({ classCode }: { classCode: string }) {
	const [classDetails, setClassDetails] = useState<ClassRoomContextType | null>(
		null
	);
	const quizObjectList = useQuizDetails(classCode, classDetails);
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

	if (!classDetails) {
		return (
			<div className="w-full lg:w-5/6 bg-white h-[95%] mt-2 flex flex-col items-center justify-start p-2 rounded-lg shadow-3d border-gray-400 border-2 m-2">
				<Loading />
			</div>
		);
	}

	return (
		<div className="w-full lg:w-5/6 bg-white h-[95%] mt-2 flex flex-col items-center justify-start p-2 rounded-lg shadow-3d border-gray-400 border-2 m-2">
			<h1 className="text-3xl text-blue-600 font-extrabold font-sans underline">
				{classDetails.className}
			</h1>
			<div className="mt-2 w-full lg:p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
				{quizObjectList?.map((quiz, index) => (
					<QuizDetailsCard key={index} {...quiz} />
				))}
			</div>
		</div>
	);
}
