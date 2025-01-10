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
	fullMarks: number, 
	totalTime: TimeStringParserReturnObjectType,
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
	let timeTakenToSeconds = timeObjectToSeconds(totalTime) - timeObjectToSeconds(timeTaken);

	console.info(timeTakenToSeconds)
	let newTimeTaken = convertSecondsToTimeObject(timeTakenToSeconds);
	console.log(timeTaken);
	console.log(newTimeTaken);
	const resultObject: ResultCalculatorReturnType = {
		marksReceived: marksReceived,
		fullMarks: fullMarks,
		noOfQuestionsAttempted: noOfQuestionsAttempted,
		noOfQuestionsCorrect: noOfQuestionsCorrect,
		noOfQuestionsIncorrect: noOfQuestionsIncorrect,
		totalNoOfQuestions: totalNoOfQuestions,
		displayTimeTaken: TimeObjectSlicer(newTimeTaken),
	};
	return resultObject;
}
function timeObjectToSeconds(
	timeTaken: TimeStringParserReturnObjectType
): number {
	if (timeTaken) {
		let seconds = 0;
		seconds =
			timeTaken.hours * 60 * 60 +
			timeTaken.minutes * 60 +
			timeTaken.seconds;
		return seconds;
	}
	return 0;
}

function convertSecondsToTimeObject(
	seconds: number
): TimeStringParserReturnObjectType {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	return { hours, minutes, seconds: remainingSeconds };
}
