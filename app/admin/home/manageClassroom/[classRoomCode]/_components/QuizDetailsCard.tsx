import { FaEdit } from "react-icons/fa";
import { QuizDetailsType } from "../_types/quizDetails";
import { AiFillDelete } from "react-icons/ai";

import { useUserContext } from "@/app/context/UserContext";
import { useClassDetails } from "../_hooks/useClassDetails";
import { useClassContext } from "../context/ClassContext";
import { deleteDocumentAndSubcollections } from "../_utils/deleteQuiz";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { useState } from "react";
import { QuestionConstructType } from "../_types/quizTypes";

export default function QuizDetailsCard({
	quiz,
	fetchDetails,
	editComponentRenderer,
}: {
	quiz: QuizDetailsType;
	fetchDetails: () => void;
	editComponentRenderer: Function;
}) {
	const classCode = useClassContext();
	const teacherDetails = useUserContext();
	const [quizQuestions, setQuizQuestions] = useState<QuestionConstructType[]>();

	if (!classCode || !teacherDetails) {
		return <div>Loading...</div>;
	}

	const classDetails = useClassDetails(classCode.classCode, teacherDetails);

	if (!classDetails || !classDetails.classRoomDetails) {
		return <div>Loading class details...</div>;
	}

	async function quizDeleteHandler(e: any) {
		const docPath = `classrooms/${classCode.classCode}/subjects/${classDetails.classRoomDetails.selectedSubject}/quizzes/${quiz.title}`;
		await deleteDocumentAndSubcollections(docPath);
		fetchDetails();
	}

	async function handleEditHover(e: any) {
		if (!quizQuestions) {
			const questionCollectionRef = collection(
				db,
				`classrooms/${classCode.classCode}/subjects/${classDetails.classRoomDetails.selectedSubject}/quizzes/${quiz.title}/questions`
			);
			const questionsSnap = getDocs(questionCollectionRef);
			const questionDataList: QuestionConstructType[] = [];
			(await questionsSnap).forEach((doc) => {
				const questionData = doc.data() as QuestionConstructType;
				questionDataList.push(questionData);
			});
			console.log(questionDataList);
			setQuizQuestions(questionDataList);
		}
	}
	function handleEditButtonClick(e: any) {
		editComponentRenderer(true, quiz.title);
	}
	return (
		<div
			className="w-full border border-slate-300 shadow-lg rounded-md bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col justify-between col-span-1 overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
			onMouseEnter={handleEditHover}
		>
			<div className="p-4">
				<h1 className="font-bold text-2xl mb-2">{quiz.title}</h1>
				<p className="text-sm text-slate-200 font-semibold">
					Full Marks: {quiz.fullMarks}
				</p>
				<p className="text-sm text-slate-200 font-semibold">
					Time Duration: {quiz.timeDuration}
				</p>
			</div>
			<div className="bg-white h-12 flex items-center justify-evenly rounded-b-md p-1">
				<div
					className="flex items-center justify-center border-2 border-gray-400 text-black p-1.5 rounded-md w-full m-1 h-15 hover:bg-gray-400 hover:text-white cursor-pointer"
					onClick={handleEditButtonClick}
				>
					<FaEdit className="mr-2" />
					Edit Quiz
				</div>
				<div
					className="flex items-center justify-center text-red-600 border-red-600 p-1.5 rounded-md w-full m-1 h-15 border-2 hover:bg-red-600 hover:text-white cursor-pointer"
					onClick={quizDeleteHandler}
				>
					<AiFillDelete className="mr-2" />
					Delete Quiz
				</div>
			</div>
		</div>
	);
}
