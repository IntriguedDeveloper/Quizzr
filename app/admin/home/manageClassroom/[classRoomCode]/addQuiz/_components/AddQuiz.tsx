"use client";
import React, { useState } from "react";
import { useUserContext } from "@/app/context/UserContext";
import { useClassContext } from "../../context/ClassContext";
import { useClassDetails } from "../../_hooks/useClassDetails";
import { QuestionCard } from "./QuestionCard";
import ConfirmationModal from "./ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as mammoth from "mammoth";
import { AnswerChoice, QuestionConstructType } from "../../_types/quizTypes";

export default function AddQuiz() {
	const TeacherDetails = useUserContext();
	const classCode = useClassContext().classCode;
	const classData = useClassDetails(
		classCode,
		TeacherDetails
	).classRoomDetails;
	const teacherName = TeacherDetails?.userName;
	const [activeTab, setActiveTab] = useState("manual");
	const initialChoices = Array.from({ length: 4 }, (_, index) => ({
		choiceIndex: index,
		choiceContent: "",
	}));

	const [questionsArray, setQuestionsArray] = useState<
		QuestionConstructType[]
	>([
		{
			QuestionTitle: "",
			AnswerChoices: initialChoices,
			CorrectOptionIndex: 0,
			QuestionIndex: 1,
		},
	]);

	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [renderIndex, setRenderIndex] = useState(0);
	const [updateQuestions, setUpdateQuestions] = useState(false);
	const [animationClass, setAnimationClass] = useState(
		"animate-fadeInVertical"
	);

	const parseQuestions = async (content: string) => {
		setUpdateQuestions(false);
		try {
			const questions: QuestionConstructType[] = [];
			const sections = content.split(/(?=(\d+)\.\s*<--)/).filter(Boolean);
			let QuestionIndex = 0;
			for (const section of sections) {
				console.log("New Question", QuestionIndex);

				const titleMatch = section.match(/(\d+)\.\s*<--(.*?)-->/);
				if (!titleMatch) continue;

				const questionTitle = titleMatch[2].trim();
				const options: AnswerChoice[] = [];

				const optionsText = section.slice(titleMatch[0].length);
				const optionMatches = [
					...optionsText.matchAll(
						/(\d+)\.\s*(.*?)(?=(?:\d+\.|C\d+|$))/gs
					),
				];

				optionMatches.forEach((match) => {
					const choiceIndex = parseInt(match[1]);
					const choiceContent = match[2].trim();
					if (choiceContent) {
						options.push({ choiceIndex, choiceContent });
					}
				});

				const correctAnswerMatch = section.match(/(C)(\d+)/);
				let correctOptionIndex = 0;

				if (correctAnswerMatch) {
					console.log(correctAnswerMatch[2]);
					correctOptionIndex = Number(correctAnswerMatch[2]);
				}

				if (options.length > 0) {
					questions.push({
						QuestionTitle: questionTitle,
						AnswerChoices: options,
						CorrectOptionIndex: correctOptionIndex,
						QuestionIndex: QuestionIndex + 1,
					});
				}
				QuestionIndex++;
			}

			if (questions.length > 0) {
				console.log(
					"Parsed questions:",
					JSON.stringify(questions, null, 2)
				);

				await setQuestionsArray(questions);
				await setUpdateQuestions(true);
				toast.success(
					`Loaded ${questions.length} questions successfully!`,
					{
						position: "top-center",
						autoClose: 3000,
					}
				);
			} else {
				toast.error("No valid questions found in the file!", {
					position: "top-center",
					autoClose: 3000,
				});
			}
		} catch (error) {
			console.error("Error parsing questions:", error);
			toast.error("Error parsing the file. Please check the format!", {
				position: "top-center",
				autoClose: 3000,
			});
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.name.endsWith(".txt")) {
			const reader = new FileReader();
			reader.onload = () => {
				const content = reader.result as string;
				parseQuestions(content);
			};
			reader.readAsText(file);
		} else if (file.name.endsWith(".docx")) {
			const reader = new FileReader();
			reader.onload = async () => {
				try {
					const content = await readDocxFile(
						reader.result as ArrayBuffer
					);
					parseQuestions(content);
				} catch (error) {
					toast.error("Error reading DOCX file!", {
						position: "top-center",
						autoClose: 3000,
					});
				}
			};
			reader.readAsArrayBuffer(file);
		} else {
			toast.error("Please upload a .txt or .docx file!", {
				position: "top-center",
				autoClose: 3000,
			});
		}
	};

	const readDocxFile = (arrayBuffer: ArrayBuffer) => {
		return new Promise<string>((resolve, reject) => {
			mammoth
				.extractRawText({ arrayBuffer })
				.then((result) => {
					resolve(result.value);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	const updateQuestion = (
		QuestionBodyObject: QuestionConstructType,
		QuestionIndex: number
	): Promise<void> => {
		return new Promise((resolve) => {
			setQuestionsArray((prevArray) => {
				const updatedArray = prevArray.map((item, i) =>
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
						QuestionIndex: renderIndex + 1,
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

	const useAIQuestionExtraction = () => {
		
	};
	return (
		<>
			<div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-xl">
				{/* Header */}
				<div className="border-b p-6 text-center">
					<h1 className="text-3xl font-bold text-blue-700 mb-2">
						Create New Quiz
					</h1>
					{classData.selectedSubject && (
						<div className="text-lg font-medium text-gray-600">
							Subject: {classData.selectedSubject}
						</div>
					)}
				</div>

				{/* Tabs */}
				<div className="p-6">
					<div className="flex border-b mb-6">
						<button
							className={`px-6 py-3 font-medium text-sm ${
								activeTab === "manual"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500 hover:text-gray-700"
							}`}
							onClick={() => setActiveTab("manual")}
						>
							Manual Creation
						</button>
						<button
							className={`px-6 py-3 font-medium text-sm ${
								activeTab === "import"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500 hover:text-gray-700"
							}`}
							onClick={() => setActiveTab("import")}
						>
							Import Questions
						</button>
					</div>

					{/* Manual Creation Tab */}
					{activeTab === "manual" && (
						<div className="space-y-6">
							<div
								className={`transition-all duration-300 ${animationClass} flex justify-center`}
							>
								<QuestionCard
									updateQuestion={updateQuestion}
									currentIndex={renderIndex}
									nextQuestionTransition={
										nextQuestionTransition
									}
									previousQuestionTransition={
										previousQuestionTransition
									}
									key={renderIndex}
									questionBody={questionsArray[renderIndex]}
									animationClass={animationClass}
									noOfQuestions={questionsArray.length - 1}
									updateQuestions={updateQuestions}
								/>
							</div>

							<div className="flex justify-between items-center mt-6">
								<button
									onClick={() =>
										previousQuestionTransition(renderIndex)
									}
									disabled={renderIndex === 0}
									className={`flex items-center px-4 py-2 rounded-lg border ${
										renderIndex === 0
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 19l-7-7 7-7"
										/>
									</svg>
									Previous
								</button>

								<div className="text-sm font-medium text-gray-500">
									Question {renderIndex + 1} of{" "}
									{questionsArray.length}
								</div>

								<button
									onClick={() =>
										nextQuestionTransition(renderIndex)
									}
									className="flex items-center px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
								>
									Next
									<svg
										className="w-5 h-5 ml-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>
					)}

					{/* Import Tab */}
					{activeTab === "import" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* File Upload Card */}
							<div
								onClick={() =>
									document
										.getElementById("fileInput")
										?.click()
								}
								className="p-8 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer group"
							>
								<div className="flex flex-col items-center gap-4">
									<svg
										className="w-12 h-12 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
									<div className="text-center">
										<h3 className="font-semibold text-lg group-hover:text-blue-600">
											Upload Document
										</h3>
										<p className="text-sm text-gray-500">
											Import questions from .txt or .docx
											files
										</p>
									</div>
								</div>
							</div>

							{/* AI Extraction Card */}
							<div className="p-8 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer group">
								<div className="flex flex-col items-center gap-4">
									<svg
										className="w-12 h-12 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
									<div className="text-center">
										<h3 className="font-semibold text-lg group-hover:text-blue-600">
											AI Extraction
										</h3>
										<p className="text-sm text-gray-500">
											Use AI to generate questions
										</p>
									</div>
								</div>
							</div>

							<input
								type="file"
								id="fileInput"
								className="hidden"
								onChange={handleFileUpload}
								accept=".txt, .doc, .docx"
							/>
						</div>
					)}

					{/* Save Button */}
					<div className="flex justify-center mt-8">
						<button
							onClick={handleModalOpen}
							className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
								/>
							</svg>
							Save Quiz
						</button>
					</div>
				</div>

				<ToastContainer />

				{showConfirmationModal && (
					<ConfirmationModal
						onClose={() => setShowConfirmationModal(false)}
						noOfQuestions={questionsArray.length}
						questionsArray={questionsArray}
					/>
				)}
			</div>
		</>
	);
}
