"use client";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { QuestionCard } from "./QuestionCard";

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

export default function AddQuiz({ classCode }: AddQuizProps) {
	const TeacherDetails = useUserContext();
	const teacherName = TeacherDetails?.userName || "Unknown Teacher";

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

	const [selectedSubject, setSelectedSubject] = useState<string | null>(
		"Loading selected subject..."
	);
	const [renderIndex, setRenderIndex] = useState(0);
	const [animationClass, setAnimationClass] = useState("animate-fadeInVertical"); // Animation state

	useEffect(() => {
		const fetchSelectedSubject = async () => {
			try {
				const subjectDoc = await getDocs(
					query(
						collection(db, `classrooms/${classCode}/subjects`),
						where("relatedTeacherName", "==", teacherName)
					)
				);
				if (!subjectDoc.empty) {
					setSelectedSubject(subjectDoc.docs[0].id);
				} else {
					setSelectedSubject("No subject found.");
				}
			} catch (error) {
				console.error("Error fetching subject:", error);
				setSelectedSubject("Error loading subject.");
			}
		};

		fetchSelectedSubject();
	}, [teacherName, classCode]);

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
		setAnimationClass("animate-slideLeftToRight"); // Transition animation class for next
	};

	const previousQuestionTransition = (currentIndex: number) => {
		if (currentIndex === renderIndex && renderIndex !== 0) {
			setRenderIndex((prevRenderIndex) => prevRenderIndex - 1);
			setAnimationClass("animate-slideRightToLeft"); // Transition animation class for previous
		}
	};

	return (
		<div className="lg:w-5/6 w-full bg-blue-300 mt-2 rounded-lg flex flex-col items-center justify-center p-2 mb-5 shadow-sm">
			<h2 className="text-2xl font-semibold text-blue-800 mb-4">Create a Quiz</h2>

			<div className="text-lg font-bold">
				{selectedSubject ? (
					<>Selected Subject: {selectedSubject}</>
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
				animationClass={animationClass} // Pass the animation class here
			/>
		</div>
	);
}
