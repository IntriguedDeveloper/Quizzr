"use client";
import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { QuestionCard } from "./QuestionCard";
import ConfirmationModal from "./ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useClassRoomContext } from "@/app/admin/context/ClassRoomContext";

interface AddQuizProps {
	classCode: string;
}
export type AnswerChoice = {
	choiceIndex: number;
	choiceContent: string;
};
export type QuestionConstructType = {
	QuestionTitle: string;
	AnswerChoices: AnswerChoice[];
	CorrectOptionIndex: number;
};

export default function AddQuiz() {
	const TeacherDetails = useUserContext();
	const classData = useClassRoomContext();

	const teacherName = TeacherDetails?.userName;

	const initialChoices = Array.from({ length: 4 }, (_, index) => ({
		choiceIndex: index,
		choiceContent: "",
	}));

	const [questionsArray, setQuestionsArray] = useState<QuestionConstructType[]>(
		[
			{
				QuestionTitle: "",
				AnswerChoices: initialChoices,
				CorrectOptionIndex: 0,
			},
		]
	);

	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const [renderIndex, setRenderIndex] = useState(0);
	const [animationClass, setAnimationClass] = useState(
		"animate-fadeInVertical"
	);

	const updateQuestion = (
		QuestionBodyObject: QuestionConstructType,
		QuestionIndex: number
	): Promise<void> => {
		return new Promise((resolve) => {
			setQuestionsArray((prevArray) => {
				const updatedArray = prevArray?.map((item, i) =>
					i === QuestionIndex ? { ...QuestionBodyObject } : item
				);
				resolve();
				return updatedArray;
			});
		});
	};

	const nextQuestionTransition = (currentIndex: number) => {
		setQuestionsArray((prevQuestions) => {
			if (currentIndex === prevQuestions.length - 1) {
				return [
					...prevQuestions,
					{
						QuestionTitle: "",
						AnswerChoices: initialChoices,
						CorrectOptionIndex: 0,
					},
				];
			}
			return prevQuestions;
		});
		setRenderIndex((prevRenderIndex) => prevRenderIndex + 1);
		setAnimationClass("animate-slideLeftToRight");
	};

	const previousQuestionTransition = (currentIndex: number) => {
		if (currentIndex === renderIndex && renderIndex !== 0) {
			setRenderIndex((prevRenderIndex) => prevRenderIndex - 1);
			setAnimationClass("animate-slideRightToLeft");
		}
	};

	const handleModalOpen = () => {
		if (questionsArray.length < 5) {
			toast.error("You must add at least 5 questions to proceed!", {
				position: "top-center",
				autoClose: 3000,
			});
		} else {
			setShowConfirmationModal(true);
		}
	};

	return (
		<>
			<ToastContainer /> {/* Include ToastContainer to render the toast */}
			{showConfirmationModal && (
				<ConfirmationModal
					onClose={() => setShowConfirmationModal(false)}
					noOfQuestions={questionsArray.length}
				/>
			)}
			<div className="lg:w-5/6 w-full bg-blue-300 lg:mt-2 lg:rounded-lg flex flex-col items-center justify-center p-2 mb-5 shadow-sm">
				<h2 className="text-2xl font-semibold text-blue-800 mb-4">
					Create a Quiz
				</h2>

				<div className="text-lg font-bold">
					{classData.selectedSubject ? (
						<>Selected Subject: {classData.selectedSubject}</>
					) : (
						"Loading selected subject..."
					)}
				</div>

				<QuestionCard
					updateQuestion={updateQuestion}
					currentIndex={renderIndex}
					nextQuestionTransition={nextQuestionTransition}
					previousQuestionTransition={previousQuestionTransition}
					key={renderIndex}
					questionBody={questionsArray[renderIndex]}
					animationClass={animationClass}
				/>
				<button
					className="px-12 py-2 mt-4 bg-blue-600 rounded-md font-extrabold text-xl text-white hover:bg-blue-700 border-black outline-none border-2"
					onClick={handleModalOpen}
				>
					Add Quiz Details
				</button>
			</div>
		</>
	);
}
