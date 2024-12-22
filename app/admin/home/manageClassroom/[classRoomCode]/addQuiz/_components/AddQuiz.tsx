"use client";
import { useUserContext } from "@/app/context/UserContext";
import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import ConfirmationModal from "./ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as mammoth from "mammoth";
import { AnswerChoice, QuestionConstructType } from "../../_types/quizTypes";
import { useClassContext } from "../../context/ClassContext";
import { useClassDetails } from "../../_hooks/useClassDetails";
export default function AddQuiz() {
	const TeacherDetails = useUserContext();
	const classCode = useClassContext().classCode;
	const classData = useClassDetails(classCode, TeacherDetails).classRoomDetails;
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
				QuestionIndex: 1,
			},
		]
	);

	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [renderIndex, setRenderIndex] = useState(0);
	const [updateQuestions, setUpdateQuestions] = useState(false);
	const [animationClass, setAnimationClass] = useState(
		"animate-fadeInVertical"
	);

	const parseQuestions = async(content: string) => {
		setUpdateQuestions(false);
		try {
			const questions: QuestionConstructType[] = [];
			const sections = content.split(/(?=(\d+)\.\s*<--)/).filter(Boolean);
			let QuestionIndex = 0;
			for (const section of sections) {
				console.log("New Question" , QuestionIndex)
				
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
				
				console.log("Parsed questions:", JSON.stringify(questions, null, 2));

				await setQuestionsArray(questions);
				await setUpdateQuestions(true);
				toast.success(`Loaded ${questions.length} questions successfully!`, {
					position: "top-center",
					autoClose: 3000,
				});
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
					const content = await readDocxFile(reader.result as ArrayBuffer);
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
						QuestionIndex: renderIndex+1,
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
			<ToastContainer />
			{showConfirmationModal && (
				<ConfirmationModal
					onClose={() => setShowConfirmationModal(false)}
					noOfQuestions={questionsArray.length}
					questionsArray={questionsArray}
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
				<label
					className="w-full lg:w-3/5 rounded-lg font-bold h-20 bg-white text-blue-600 hover:bg-cyan-200 flex items-center justify-center text-lg cursor-pointer"
					htmlFor="fileInput"
				>
					Upload a Text File
				</label>
				<input
					type="file"
					id="fileInput"
					className="hidden"
					onChange={handleFileUpload}
					accept=".txt, .doc, .docx"
				/>
				<QuestionCard
					updateQuestion={updateQuestion}
					currentIndex={renderIndex}
					nextQuestionTransition={nextQuestionTransition}
					previousQuestionTransition={previousQuestionTransition}
					key={renderIndex}
					questionBody={questionsArray[renderIndex]}
					animationClass={animationClass}
					noOfQuestions={questionsArray.length - 1}
					updateQuestions={updateQuestions}
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
