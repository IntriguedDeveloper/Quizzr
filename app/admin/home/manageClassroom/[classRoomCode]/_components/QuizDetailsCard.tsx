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
import Loading from "../loading";

export default function QuizDetailsCard({
	quiz,
	fetchDetails,
	editComponentRenderer,
}: {
	quiz: QuizDetailsType;
	fetchDetails: (quiz: QuizDetailsType) => void;
	editComponentRenderer: Function;
}) {
	const classCode = useClassContext();
	const teacherDetails = useUserContext();
	const [quizQuestions, setQuizQuestions] =
		useState<QuestionConstructType[]>();
	const [isDeleting, setIsDeleting] = useState(false);
	if (!classCode || !teacherDetails) {
		return <div>Loading...</div>;
	}

	const classDetails = useClassDetails(classCode.classCode, teacherDetails);

	if (!classDetails || !classDetails.classRoomDetails) {
		return <div>Loading class details...</div>;
	}

	async function quizDeleteHandler(e: any) {
		setIsDeleting(true);
		const docPath = `classrooms/${classCode.classCode}/subjects/${classDetails.classRoomDetails.selectedSubject}/quizzes/${quiz.title}`;
		await deleteDocumentAndSubcollections(docPath);
		fetchDetails(quiz);
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
					{isDeleting ? (
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-red-600 animate-spin fill-white"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					) : (
						<>
							<AiFillDelete className="mr-2" />
							Delete Quiz
						</>
					)}
				</div>
			</div>
		</div>
	);
}
