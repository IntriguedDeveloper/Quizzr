"use client";

import { useEffect, useState } from "react";
import {
	ClassRoomContextType,
	useClassDetails,
} from "./_hooks/useClassDetails";
import { useUserContext } from "@/app/context/UserContext";
import QuizDetailsCard from "./_components/QuizDetailsCard";
import Loading from "./loading";
import { useQuizDetails } from "./_hooks/useQuizDetails";
import { fetchActiveQuizzes } from "./_utils/fetchActiveQuizzes";
import { useRouter } from "next/navigation";
import EditQuiz from "./editQuiz/EditQuiz";

export default function ClassContent({ classCode }: { classCode: string }) {
	const router = useRouter();
	const [classDetails, setClassDetails] = useState<ClassRoomContextType | null>( 
		null
	);
	const [quizObjectList, setQuizObjectList] = useState<any[]>([]);
	const teacherDetails = useUserContext();
	const classDetailsResponse = useClassDetails(classCode, teacherDetails);
	const initialQuizList = useQuizDetails(classCode, classDetails);
	const [renderEditComponent, setRenderEditComponent] = useState(false);
	const [quizTitle, setQuizTitle] = useState<string>("");

	useEffect(() => {
		if (classDetailsResponse) {
			setClassDetails(classDetailsResponse.classRoomDetails);
		}
	}, [classDetailsResponse]);

	useEffect(() => {
		if (initialQuizList) {
			setQuizObjectList(initialQuizList);
		}
	}, [initialQuizList]);

	async function fetchDetails() {
		if (classDetails?.selectedSubject) {
			const data = await fetchActiveQuizzes(
				classCode,
				classDetails.selectedSubject
			);
			setQuizObjectList(data);
		}
	}

	function editComponentRenderer(status: boolean, title: string) {
		setRenderEditComponent(status);
		setQuizTitle(title);
	}

	if (!classDetails || quizObjectList.length <= 0) {
		return (
			<div className="w-full lg:w-5/6 bg-white h-[95%] mt-2 flex flex-col items-center justify-start p-2 rounded-lg shadow-3d border-gray-400 border-2 m-2">
				<Loading />
			</div>
		);
	}

	return (
		<div className="w-full lg:w-5/6 min-h-max bg-white mt-2 flex flex-col items-center justify-start p-2 rounded-lg shadow-3d border-gray-400 border-2 m-2">
			{/* Render the EditQuiz component if active */}
			{renderEditComponent && (
				<EditQuiz
					quizTitle={quizTitle}
					onClose={() => setRenderEditComponent(false)}
					selectedSubject={
						classDetailsResponse.classRoomDetails.selectedSubject || ""
					}
					teacherDetails={teacherDetails}
					classCode={classCode}
				/>
			)}

			{/* Render the main class content */}
			{!renderEditComponent && (
				<>
					<h1 className="text-3xl text-blue-600 font-extrabold-sans underline">
						{classDetailsResponse.classRoomDetails.className}
					</h1>
					<div className="w-full flex justify-center mt-4">
						<button
							className="bg-gray-300 text-slate-600 text-xl px-7 py-2 rounded-lg shadow hover:bg-gray-500 hover:text-slate-200 transition font-semibold"
							onClick={() => {
								router.push(`./${classCode}/addQuiz`);
							}}
						>
							Add Quiz
						</button>
					</div>
					<div className="mt-2 w-full lg:p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
						{quizObjectList.map((quiz, index) => (
							<QuizDetailsCard
								key={index}
								quiz={quiz}
								fetchDetails={fetchDetails}
								editComponentRenderer={editComponentRenderer}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
