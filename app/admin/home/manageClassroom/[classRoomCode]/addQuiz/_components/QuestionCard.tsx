import { ChangeEvent, useEffect, useState } from "react";
import { AnswerChoice } from "../../_types/quizTypes";
import { QuestionConstructType } from "../../_types/quizTypes";

export function QuestionCard({
	currentIndex,
	updateQuestion,
	nextQuestionTransition,
	previousQuestionTransition,
	questionBody,
	animationClass,
	noOfQuestions,
	updateQuestions,
}: {
	currentIndex: number;
	updateQuestion: (
		QuestionBodyObject: QuestionConstructType,
		QuestionIndex: number
	) => void;
	nextQuestionTransition: (currentIndex: number) => void;
	previousQuestionTransition: (currentIndex: number) => void;
	questionBody: QuestionConstructType;
	animationClass: string;
	noOfQuestions: number;
	updateQuestions: boolean;
}) {
	const [questionTitle, setQuestionTitle] = useState<string>("");
	const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(questionBody.CorrectOptionIndex);
	const [optionList, setOptionList] = useState<AnswerChoice[]>(
		Array(4).fill({ choiceContent: "", choiceIndex: 0 })
	);

	useEffect(() => {
		setQuestionTitle(questionBody.QuestionTitle);
		setCorrectOptionIndex(questionBody.CorrectOptionIndex);
		setOptionList(questionBody.AnswerChoices);
	}, [currentIndex, updateQuestions]);

	const saveQuestion = () => {
		const finalQuestionConstruct: QuestionConstructType = {
			QuestionTitle: questionTitle,
			AnswerChoices: optionList,
			CorrectOptionIndex: correctOptionIndex,
		};
		updateQuestion(finalQuestionConstruct, currentIndex);
	};

	const optionInputSetter = (
		e: ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const optionBody: AnswerChoice = {
			choiceContent: e.target.value,
			choiceIndex: index,
		};
		setOptionList((prevArray) =>
			prevArray?.map((item, i) => (i + 1 === index ? { ...optionBody } : item))
		);
	};

	const QuestionTitleSetter = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setQuestionTitle(e.target.value);
	};

	const CorrectOptionIndexSetter = (e: ChangeEvent<HTMLSelectElement>) => {
		setCorrectOptionIndex(Number(e.target.value));
	};

	useEffect(() => {
		saveQuestion();
	}, [correctOptionIndex]);

	useEffect(() => {
		saveQuestion();
	}, [questionTitle, optionList]);

	function previousQuestionNavigate(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		previousQuestionTransition(currentIndex);
	}

	function nextQuestionNavigate(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		nextQuestionTransition(currentIndex);
	}

	return (
		<div
			className={`flex flex-col p-5 lg:w-3/5 w-full h-full mt-2 justify-center items-center bg-indigo-200 lg:rounded-lg  ${animationClass}`}
		>
			<a className="mb-2 text-xl font-semibold text-slate-600">
				Question Number {currentIndex + 1}
			</a>

			{/* Text prompt for question title */}
			<div className="w-full mb-2 text-sm text-gray-700">
				Enter the question title:
			</div>
			<div className="w-full">
				<textarea
					className="resize-none w-full p-2 h-32 rounded-md"
					onChange={QuestionTitleSetter}
					defaultValue={questionTitle}
				></textarea>
			</div>

			{/* Text prompt for options */}
			<div className="bg-white rounded-lg p-2 w-full flex-col flex items-center justify-center mt-2">
				<div className="w-full mb-2 text-sm text-gray-700">
					Enter the answer choices:
				</div>
				{optionList.map((optionObject, index) => (
					<Option
						index={index + 1}
						optionInputSetter={optionInputSetter}
						key={index}
						optionValue={optionObject.choiceContent}
					></Option>
				))}
			</div>
			<div className="mt-1 flex flex-col items-center justify-center">
				<div className="w-full mb-2 text-sm text-gray-700">
					Select correct option :
				</div>
				<select
					name="correctIndex"
					className="h-10 p-2 rounded-md w-32"
					onChange={CorrectOptionIndexSetter}
					defaultValue={correctOptionIndex === 0 ? 1 : correctOptionIndex}
				>
					{Array.from({ length: 4 }).map((_, index) => (
						<option value={index + 1} key={index}>
							{index + 1}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-row mt-5">
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
					{currentIndex === noOfQuestions ? "Add Question" : "Next Question"}
				</button>
			</div>
		</div>
	);
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
			{/* Option label */}
			<div className="h-full p-2 text-gray-700">{index}.</div>
			<input
				className="w-full p-2"
				onChange={(e) => optionInputSetter(e, index)}
				defaultValue={optionValue}
			></input>
		</div>
	);
}
