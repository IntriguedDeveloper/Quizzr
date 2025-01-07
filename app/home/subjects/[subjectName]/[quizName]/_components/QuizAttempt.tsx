import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
	TimeObjectSlicer,
	TimeStringParser,
	TimeStringParserReturnObjectType,
} from "./QuizDetails";
import {
	AnswerChoice,
	QuestionConstructType,
} from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";
import { QuizDetailsType } from "../page";
import toast, { Toaster } from "react-hot-toast";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { useUserContext } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { calculateResults } from "../analyseResults/utils";

export type QuizAttemptReturnType = {
	selectedQuizQuestions: QuestionConstructType[];
	timeTaken: TimeStringParserReturnObjectType;
};

export default function QuizAttempt({
	quizDetails,
	quizQuestions,
	classCode,
	previewToggler,
}: {
	quizDetails: QuizDetailsType;
	quizQuestions: QuestionConstructType[];
	classCode: string;
	previewToggler: () => void;
}) {
	const parsedTimeObject = TimeStringParser(quizDetails.timeDuration);
	const timeDurationString = TimeObjectSlicer(parsedTimeObject);
	const [quizCountDown, setQuizCountdown] = useState(parsedTimeObject);
	const [isQuizCountDown, setIsQuizCountdown] = useState(false);
	const [countdownNum, setCountDownNum] = useState(3);
	const [isCountDown, setIsCountDown] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedQuizQuestions, setSelectedQuizQuestions] =
		useState(quizQuestions);
	const userDetails = useUserContext();
	const router = useRouter();
	useEffect(() => {
		if (!isCountDown && isQuizCountDown) {
			const timer = setInterval(() => {
				setQuizCountdown((prev) => {
					const { hours, minutes, seconds } = prev;
					if (hours === 0 && minutes === 0 && seconds === 0) {
						clearInterval(timer);
						toast("Time's Up! ✔");
						handleSubmit();
						return prev;
					}

					let newSeconds = seconds - 1;
					let newMinutes = minutes;
					let newHours = hours;

					if (newSeconds < 0) {
						newSeconds = 59;
						newMinutes--;
					}
					if (newMinutes < 0) {
						newMinutes = 59;
						newHours--;
					}

					return {
						hours: newHours,
						minutes: newMinutes,
						seconds: newSeconds,
					};
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [isCountDown, isQuizCountDown]);
	useEffect(() => {
		if (isCountDown) {
			const timer = setInterval(() => {
				setCountDownNum((prev) => {
					if (prev <= 1) {
						clearInterval(timer);

						setIsCountDown(false);
						setIsQuizCountdown(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [isCountDown]);

	const handleOptionSelect = (index: number) => {
		const updatedQuestions = [...selectedQuizQuestions];
		updatedQuestions[currentIndex].SelectedIndex = index + 1;
		setSelectedQuizQuestions(updatedQuestions);
	};

	const handleNextQuestionClick = () => {
		setCurrentIndex((prevIndex) =>
			Math.min(prevIndex + 1, quizQuestions.length - 1)
		);
	};

	const handlePreviousQuestionClick = () => {
		setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
	};

	const handleSubmit = async () => {
		try {
			if (userDetails.userID && classCode) {
				await setDoc(
					doc(
						db,
						`classrooms/${classCode}/students/${userDetails.userID}/attempted-quizzes/${quizDetails.title}`
					),
					{
						selectedQuizQuestions: selectedQuizQuestions,
						timeTaken: quizCountDown,
					}
				);
				const quizResults = await calculateResults(
					selectedQuizQuestions,
					quizCountDown,
					quizDetails.fullMarks
				);
				await addDoc(
					collection(
						db,
						`classrooms/${classCode}/students/${userDetails.userID}/attempted-quizzes/${quizDetails.title}/quiz-result`
					),
					quizResults,
				);
				router.push("./analyseResults");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const calculateProgress = () => {
		const totalSeconds =
			quizCountDown.hours * 3600 +
			quizCountDown.minutes * 60 +
			quizCountDown.seconds;
		const initialTime =
			parsedTimeObject.hours * 3600 +
			parsedTimeObject.minutes * 60 +
			parsedTimeObject.seconds;
		return (totalSeconds / initialTime) * 100;
	};
	return (
		<>
			<Toaster></Toaster>
			{isCountDown ? (
				<div
					className="w-full flex items-center justify-center"
					style={{
						height: "calc(100vh - 5rem)",
					}}
				>
					<div className="text-blue-600 text-8xl font-bold drop-shadow-lg">
						{countdownNum}
					</div>
				</div>
			) : (
				<div className="flex flex-col justify-normal h-full w-full bg-white lg:rounded-lg lg:p-4 p-2 relative">
					<h1 className="text-center text-3xl font-semibold text-blue-600 mb-4">
						{quizDetails.title}
					</h1>
					<div className="absolute right-2 top-2 flex items-center justify-center bg-gray-100 rounded-lg p-2 text-sm lg:text-lg md:text-lg">
						{`${quizCountDown.hours} hrs ${quizCountDown.minutes} mins ${quizCountDown.seconds} sec`}
					</div>

					<div className="w-full h-2 bg-gray-200 mt-4 mb-4  rounded-lg">
						<div
							className={`h-full ${
								calculateProgress() < 30
									? "bg-red-600"
									: "bg-blue-600"
							} rounded-lg`}
							style={{ width: `${calculateProgress()}%` }}
						></div>
					</div>

					<div className="border border-blue-400 rounded-md pr-4 pl-4 pt-2 pb-2 relative">
						<div className="absolute top-2 left-2 text-md font-bold text-gray-500">
							{currentIndex + 1}/{quizQuestions.length}
						</div>
						<div className="flex justify-center items-center h-max flex-col">
							<h1 className="font-bold text-2xl mb-5">
								Question {currentIndex + 1}
							</h1>
							<div className="w-full bg-gray-200 rounded-lg p-5 text-lg flex justify-center ">
								{quizQuestions[currentIndex].QuestionTitle}
							</div>
							<div className="flex flex-col justify-around items-center bg-slate-300 mt-2 rounded-lg p-2 w-full h-max">
								{quizQuestions[currentIndex].AnswerChoices.map(
									(option: AnswerChoice, index: number) => (
										<div
											key={index}
											className="bg-white rounded-md w-full p-2 text-lg m-1 flex flex-row items-center justify-start cursor-pointer"
											onClick={() =>
												handleOptionSelect(index)
											}
										>
											<FaCheckCircle
												className={`text-blue-600 mr-3 w-6 h-6	 ${
													index + 1 !==
														selectedQuizQuestions[
															currentIndex
														].SelectedIndex &&
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
									} `}
									onClick={handlePreviousQuestionClick}
								>
									Previous Question
								</button>

								<button
									className={`px-4 py-2 border bg-red-400 text-white rounded-md font-semibold ${
										currentIndex ===
											quizQuestions.length - 1 &&
										"invisible"
									}`}
									onClick={handleNextQuestionClick}
								>
									Next Question
								</button>
							</div>

							<button
								className="absolute right-2 top-2 bg-red-600 text-white font-bold text-md w-20 p-2 rounded-lg"
								onClick={handleSubmit}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
