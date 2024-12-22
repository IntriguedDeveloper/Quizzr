import { useState, ChangeEvent, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import useSWR from "swr";
import { QuestionConstructType, AnswerChoice } from "../_types/quizTypes";
import { toast } from "react-toastify";

import { useUserContext } from "@/app/context/UserContext";
import { useClassDetails } from "../_hooks/useClassDetails";
import { useQuizDetails } from "../_hooks/useQuizDetails";
import { useClassContext } from "../context/ClassContext";

async function fetchQuizFromTitle(
	quizTitle: string,
	classCode: string,
	teacherDetails: any,
	selectedSubject: string
): Promise<QuestionConstructType[]> {
	const quizQuestionsList: QuestionConstructType[] = [];
	const docSnap = await getDocs(
		collection(
			db,
			`classrooms/${classCode}/subjects/${selectedSubject}/quizzes/${quizTitle}/questions`
		)
	);
	docSnap.forEach((doc) => {
		quizQuestionsList.push(doc.data() as QuestionConstructType);
	});
	return quizQuestionsList;
}

function Option({
	index,
	optionInputSetter,
	optionValue,
}: {
	index: number;
	optionInputSetter: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
	optionValue: string;
}) {
	return (
		<div className="w-full border-2 rounded-sm flex flex-row mb-2">
			<div className="h-full p-2 text-gray-700">{index}.</div>
			<input
				className="w-full p-2"
				onChange={(e) => optionInputSetter(e, index)}
				defaultValue={optionValue}
			/>
		</div>
	);
}

export default function EditQuiz({
	quizTitle,
	classCode,
	teacherDetails,
	selectedSubject,
	onClose,
}: {
	quizTitle: string;
	classCode: string;
	teacherDetails: any;
	selectedSubject: string;
	onClose: () => void;
}) {
	const [modifiedQuizTitle, setModifiedQuizTitle] = useState(quizTitle);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [questionTitle, setQuestionTitle] = useState<string>("");
	const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
	const [optionList, setOptionList] = useState<AnswerChoice[]>(
		Array(4).fill({ choiceContent: "", choiceIndex: 0 })
	);
	const [originalData, setOriginalData] = useState<QuestionConstructType[]>([]);
	const [modifiedData, setModifiedData] = useState<QuestionConstructType[]>([]);

	const { data, error } = useSWR<QuestionConstructType[]>(
		["fetchQuiz", quizTitle, classCode, teacherDetails, selectedSubject],
		() =>
			fetchQuizFromTitle(quizTitle, classCode, teacherDetails, selectedSubject)
	);

	useEffect(() => {
		if (data) {
			setOriginalData(data);
			setModifiedData([...data]);
		}
	}, [data]);

	useEffect(() => {
		if (modifiedData[currentIndex]) {
			setQuestionTitle(modifiedData[currentIndex].QuestionTitle);
			setCorrectOptionIndex(modifiedData[currentIndex].CorrectOptionIndex);
			setOptionList(modifiedData[currentIndex].AnswerChoices);
		}
	}, [modifiedData, currentIndex]);
	useEffect(() => {
		const saveQuestion = () => {
			if (!modifiedData) return;

			const updatedQuestion: QuestionConstructType = {
				QuestionTitle: questionTitle,
				AnswerChoices: optionList,
				CorrectOptionIndex: correctOptionIndex,
				QuestionIndex: currentIndex,
			};

			setModifiedData((prev) =>
				prev.map((q, index) => (index === currentIndex ? updatedQuestion : q))
			);
		};
		saveQuestion();
	}, [questionTitle, correctOptionIndex, optionList]);

	const QuestionTitleSetter = (e: ChangeEvent<HTMLTextAreaElement>) => {
		console.log("Updated Question title");
		setQuestionTitle(e.target.value);
	};

	const optionInputSetter = (
		e: ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const updatedOption: AnswerChoice = {
			choiceContent: e.target.value,
			choiceIndex: index,
		};
		setOptionList((prev) =>
			prev.map((opt, i) => (i + 1 === index ? updatedOption : opt))
		);
	};

	const CorrectOptionIndexSetter = (e: ChangeEvent<HTMLSelectElement>) => {
		setCorrectOptionIndex(Number(e.target.value));
	};

	const previousQuestionNavigate = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0));
	};

	const nextQuestionNavigate = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, modifiedData.length - 1));
	};

	const applyChanges = async () => {
		console.log(modifiedData);
		if (originalData && modifiedData) {
			for (let i = 0; i < modifiedData.length; i++) {
				console.log("First loop");
				const original = originalData[i];
				const modified = modifiedData[i];
				console.log("condition satisfied");
				const questionQuery = query(
					collection(
						db,
						`classrooms/${classCode}/subjects/${selectedSubject}/quizzes/${quizTitle}/questions`
					),
					where("QuestionTitle", "==", original.QuestionTitle)
				);

				const querySnapshot = await getDocs(questionQuery);
				console.info(modified.QuestionTitle)
				querySnapshot.forEach(async (doc) => {

					if(doc.data().QuestionTitle !== modified.QuestionTitle){
						console.log(modified.QuestionTitle)
					}
					await updateDoc(doc.ref, {
						QuestionTitle: modified.QuestionTitle,
						AnswerChoices: modified.AnswerChoices,
						CorrectOptionIndex: modified.CorrectOptionIndex,
					});
				});
			}

			toast.success("Quiz updated successfully!");
		}
	};

	if (error)
		return (
			<div className="flex items-center justify-center h-full">
				Error loading quiz data.
			</div>
		);
	if (!data)
		return (
			<div className="flex items-center justify-center h-full">Loading...</div>
		);

	return (
		<div className="h-full w-full z-10 relative flex flex-col justify-center items-center">
			<AiFillCloseCircle
				className="w-10 h-10 absolute top-0 right-0 cursor-pointer"
				onClick={onClose}
			/>

			<div className="flex flex-col p-5 lg:w-3/5 w-full h-full justify-center items-center bg-indigo-200 lg:rounded-lg relative">
				<div className="w-full text-md text-gray-700 text-center">
					Quiz title:
				</div>
				<input
					className="text-lg font-bold w-2/4 bg-indigo-200 text-center outline-none border-none placeholder-black"
					type="text"
					placeholder={modifiedQuizTitle}
					onChange={(e) => setModifiedQuizTitle(e.target.value)}
				></input>
				<button
					className="bg-blue-600 text-white font-semibold p-2 rounded-lg absolute right-2 top-2"
					onClick={applyChanges}
				>
					Apply Changes
				</button>
				<div className="mb-2 text-xl font-semibold text-slate-600">
					Question Number {currentIndex + 1}
				</div>

				<div className="w-full mb-2 text-sm text-gray-700 text-center">
					Enter the question title:
				</div>
				<textarea
					className="resize-none w-full p-2 h-32 rounded-md"
					onChange={QuestionTitleSetter}
					value={questionTitle}
				></textarea>

				<div className="bg-white rounded-lg p-2 w-full flex-col flex items-center justify-center mt-2">
					<div className="w-full mb-2 text-sm text-gray-700 text-center">
						Enter the answer choices:
					</div>
					{optionList.map((option, index) => (
						<Option
							key={index}
							index={index + 1}
							optionInputSetter={optionInputSetter}
							optionValue={option.choiceContent}
						/>
					))}
				</div>

				<div className="mt-1 flex flex-col items-center justify-center">
					<div className="w-full mb-2 text-sm text-gray-700 text-center">
						Select correct option :
					</div>
					<select
						className="h-10 p-2 rounded-md w-32"
						onChange={CorrectOptionIndexSetter}
						value={correctOptionIndex}
					>
						{Array.from({ length: 4 }).map((_, index) => (
							<option value={index + 1} key={index}>
								{index + 1}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-row mt-5 justify-center">
					<button
						className="mr-2 ml-2 bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-400 hover:text-black"
						onClick={previousQuestionNavigate}
					>
						Previous Question
					</button>
					<button
						className="mr-2 ml-2 bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-400 hover:text-black"
						onClick={nextQuestionNavigate}
					>
						{currentIndex === modifiedData.length - 1
							? "Add Question"
							: "Next Question"}
					</button>
				</div>
			</div>
		</div>
	);
}
