"use client";
import { useState } from "react";
import {
	FaArrowAltCircleLeft,
	FaBackward,
	FaCheckCircle,
} from "react-icons/fa";
import { QuestionConstructType } from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";
import { QuizDetailsType } from "../page";
import { useRouter } from "next/navigation";

export default function QuizSolutions({
	QuizArray,
	QuizDetails,
}: {
	QuizArray: QuestionConstructType[];
	QuizDetails: QuizDetailsType;
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const router = useRouter();
	const handleNextQuestionClick = () => {
		setCurrentIndex((prevIndex) =>
			Math.min(prevIndex + 1, QuizArray.length - 1)
		);
	};

	const handlePreviousQuestionClick = () => {
		setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
	};

	return (
		<div className="flex flex-col justify-normal h-full w-full bg-white lg:rounded-lg lg:p-4 p-2 relative">
			<h1 className="text-center lg:text-3xl text-xl font-semibold text-blue-600 mb-4">
				{QuizDetails.title}
			</h1>

			<div className="border border-blue-400 rounded-md pr-4 pl-4 pt-2 pb-2 relative">
				<div className="absolute top-2 left-2 text-md font-bold text-gray-500">
					{currentIndex + 1}/{QuizArray.length}
				</div>
				<div className="flex justify-center items-center h-max flex-col">
					<h1 className="font-bold text-2xl mb-5">
						Question {currentIndex + 1}
					</h1>
					<div className="w-full bg-gray-200 rounded-lg p-5 text-md lg:text-lg flex justify-center overflow-y-auto">
						{QuizArray[currentIndex].QuestionTitle}
					</div>
					<div className="flex flex-col justify-around items-center bg-slate-300 mt-2 rounded-lg p-2 w-full h-max">
						{QuizArray[currentIndex].AnswerChoices.map(
							(option, index) => (
								<div
									key={index}
									className="bg-white rounded-md w-full p-2 text-md lg:text-lg m-1 flex flex-row items-center justify-start"
								>
									<FaCheckCircle
										className={`text-blue-600 mr-3 w-6 h-6 ${
											index + 1 !==
												QuizArray[currentIndex]
													.CorrectOptionIndex &&
											"invisible"
										}`}
									/>
									{option.choiceContent}
								</div>
							)
						)}
					</div>
					<div className="flex justify-between mt-6 w-full">
						<button
							className={`px-4 py-2 border border-red-400 text-red-500 rounded-md hover:bg-red-100 font-semibold ${
								currentIndex === 0 && "invisible"
							}`}
							onClick={handlePreviousQuestionClick}
						>
							Previous Question
						</button>

						<button
							className={`px-4 py-2 border bg-red-400 text-white rounded-md font-semibold ${
								currentIndex === QuizArray.length - 1 &&
								"invisible"
							}`}
							onClick={handleNextQuestionClick}
						>
							Next Question
						</button>
					</div>
					<div className="flex flex-row items-center justify-center text-lg bg-slate-300 p-3 rounded-lg cursor-pointer" onClick={() => router.back()}>
						<FaArrowAltCircleLeft className="mr-2 ml-2"></FaArrowAltCircleLeft>
						Back to results{" "}
					</div>
				</div>
			</div>
		</div>
	);
}
