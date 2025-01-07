import { QuestionConstructType } from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";
import {
	TimeObjectSlicer,
	TimeStringParserReturnObjectType,
} from "../_components/QuizDetails";

export type ResultCalculatorReturnType = {
	marksReceived: number;
	fullMarks: number;
	noOfQuestionsAttempted: number;
	noOfQuestionsCorrect: number;
	noOfQuestionsIncorrect: number;
	totalNoOfQuestions: number;
	displayTimeTaken: string;
};

export async function calculateResults(
	selectedQuizQuestions: QuestionConstructType[],
	timeTaken: TimeStringParserReturnObjectType,
	fullMarks: number
): Promise<ResultCalculatorReturnType> {
	let marksReceived = 0;
	let noOfQuestionsCorrect = 0;
	const totalNoOfQuestions = selectedQuizQuestions.length;
	const increment = fullMarks / totalNoOfQuestions;
	let noOfQuestionsAttempted = 0;
	for (let i = 0; i < selectedQuizQuestions.length; i++) {
		if (selectedQuizQuestions[i].SelectedIndex) {
			noOfQuestionsAttempted++;
			if (
				selectedQuizQuestions[i].SelectedIndex ===
				selectedQuizQuestions[i].CorrectOptionIndex
			) {
				marksReceived = marksReceived + increment;
				noOfQuestionsCorrect++;
			}
		}
	}
	const noOfQuestionsIncorrect = totalNoOfQuestions - noOfQuestionsCorrect;
	const resultObject: ResultCalculatorReturnType = {
		marksReceived: marksReceived,
		fullMarks: fullMarks,
		noOfQuestionsAttempted: noOfQuestionsAttempted,
		noOfQuestionsCorrect: noOfQuestionsCorrect,
		noOfQuestionsIncorrect: noOfQuestionsIncorrect,
		totalNoOfQuestions: totalNoOfQuestions,
		displayTimeTaken: TimeObjectSlicer(timeTaken),
	};
	return resultObject;
}
